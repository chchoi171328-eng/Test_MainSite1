import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * 상담 접수 서버 엔드포인트 (지침 8단계)
 * 브라우저 → 이 라우트 → 검증(Zod) → 스팸 검증(honeypot·rate limit) → EmailJS 서버 발송 → 응답
 * 이메일 전송 실패 시 성공으로 표시하지 않는다.
 */

export const runtime = 'nodejs';

// ---- Rate limiting (인스턴스 메모리 기준, 기본 방어선) ----
const WINDOW_MS = 10 * 60 * 1000; // 10분
const MAX_REQUESTS = 5;           // IP당 10분에 5회
const attempts = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (attempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    attempts.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  attempts.set(ip, timestamps);
  // 메모리 누수 방지: 오래된 키 정리
  if (attempts.size > 1000) {
    for (const [key, ts] of attempts) {
      if (ts.every((t) => now - t >= WINDOW_MS)) attempts.delete(key);
    }
  }
  return false;
}

// ---- 입력 정제 ----
function sanitize(value: string): string {
  const withoutTags = value.replace(/<[^>]*>/g, ''); // HTML 태그 제거
  // 제어 문자 제거 (탭·개행·캐리지리턴은 유지)
  let result = '';
  for (const ch of withoutTags) {
    const code = ch.charCodeAt(0);
    if (code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127)) {
      result += ch;
    }
  }
  return result.trim();
}

const SSN_PATTERN = /\d{6}\s*[-–]\s*[1-4]\d{6}/;

// ---- 검증 스키마 ----
const CATEGORIES = ['형사 변호', '민사 소송', '가사 / 상속', '부동산 / 건설', '기업 법무', '기타'] as const;
const METHODS = ['방문 상담', '전화 상담'] as const;
const TIMES = ['평일 오전', '평일 오후', '주말(예약제)', '무관'] as const;

const consultationSchema = z.object({
  name: z.string().transform(sanitize).pipe(z.string().min(1, '이름을 입력해주세요.').max(20)),
  phone: z
    .string()
    .transform(sanitize)
    .pipe(z.string().regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, '연락처 형식이 올바르지 않습니다.')),
  email: z.string().transform(sanitize).pipe(z.string().email('이메일 형식이 올바르지 않습니다.').max(100)),
  category: z.enum(CATEGORIES),
  opponent: z.string().transform(sanitize).pipe(z.string().min(1, '상대방 이름 또는 법인명을 입력해주세요.').max(50)),
  method: z.enum(METHODS),
  availableTime: z.enum(TIMES),
  content: z
    .string()
    .transform(sanitize)
    .pipe(
      z
        .string()
        .min(10, '상담 내용을 10자 이상 입력해주세요.')
        .max(1000, '상담 내용은 1,000자 이내로 입력해주세요.')
        .refine((v) => !SSN_PATTERN.test(v), {
          message: '주민등록번호로 보이는 숫자가 포함되어 있습니다. 개인정보 보호를 위해 삭제 후 다시 제출해주세요.',
        })
    ),
  privacyAgreed: z
    .boolean()
    .refine((v) => v === true, { message: '개인정보 수집·이용 동의가 필요합니다.' }),
  // Honeypot: 사람에게는 보이지 않는 필드 — 값이 있으면 봇으로 간주
  website: z.string().max(0).optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    if (isRateLimited(ip)) {
      console.warn(`[consultation] rate limited: ip=${ip}`);
      return NextResponse.json(
        { ok: false, error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }

    // 요청 크기 제한 (대략적인 방어)
    const raw = await request.text();
    if (raw.length > 10_000) {
      return NextResponse.json({ ok: false, error: '요청이 너무 큽니다.' }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ ok: false, error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const parsed = consultationSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || '입력값을 확인해주세요.';
      // honeypot에 값이 있으면 조용히 성공 처리(봇에게 정보를 주지 않음)
      const websiteIssue = parsed.error.issues.some((e) => e.path[0] === 'website');
      if (websiteIssue) {
        console.warn(`[consultation] honeypot triggered: ip=${ip}`);
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
    }

    const data = parsed.data;

    // ---- 환경변수 검증 ----
    const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY; // 선택: EmailJS Private Key (서버 전용)

    if (!serviceId || !templateId || !publicKey) {
      console.error('[consultation] EmailJS env vars missing');
      return NextResponse.json(
        { ok: false, error: '접수 시스템 설정 오류입니다. 전화(031-658-6100)로 문의해주세요.' },
        { status: 503 }
      );
    }

    // ---- EmailJS REST API 서버 발송 ----
    const message = [
      data.content,
      '',
      '--- 추가 정보 ---',
      `이메일: ${data.email}`,
      `상대방(이해충돌 확인용): ${data.opponent}`,
      `희망 상담 방식: ${data.method}`,
      `연락 가능 시간: ${data.availableTime}`,
    ].join('\n');

    const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        ...(privateKey && { accessToken: privateKey }),
        template_params: {
          from_name: data.name,
          from_phone: data.phone,
          category: data.category,
          message,
          to_email: 'sllaw@sllaw.co.kr',
        },
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text().catch(() => '');
      console.error(`[consultation] email send failed: status=${emailRes.status} body=${errText.slice(0, 200)}`);
      return NextResponse.json(
        { ok: false, error: '전송 중 오류가 발생했습니다. 잠시 후 다시 시도하시거나 전화(031-658-6100)로 문의해주세요.' },
        { status: 502 }
      );
    }

    console.log(`[consultation] accepted: category=${data.category} ip=${ip}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[consultation] unexpected error:', error);
    return NextResponse.json(
      { ok: false, error: '접수 처리 중 오류가 발생했습니다. 전화(031-658-6100)로 문의해주세요.' },
      { status: 500 }
    );
  }
}
