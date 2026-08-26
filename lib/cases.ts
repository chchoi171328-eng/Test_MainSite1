import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CASE_FIELDS, CASE_FIELD_LABELS, normalizeCaseField, type CaseField } from './fields';

// 분야 키·표시명의 단일 소스는 lib/fields.ts — 소비처 편의를 위해 재수출
export { CASE_FIELDS, CASE_FIELD_LABELS, isCaseField, normalizeCaseField } from './fields';
export type { CaseField } from './fields';

/**
 * 성공사례 로더 (파일 기반, DB 불사용 — CASE_BOARD_BRIEF 작업 1)
 * - 폴더 1개 = 사례 1건. /content/cases/{slug}/index.md
 * - 본문은 HTML 그대로 (기존 이관분은 <p> 나열, 신규는 .case-* 구조 조각)
 * - 판결문 등 정적 자산은 public/content-assets/cases/{slug}/ 미러에서 서빙
 *   (가이드 이미지와 동일한 관례 — lib/content.ts assetUrl 참조)
 */

const CASES_DIR = path.join(process.cwd(), 'content', 'cases');

const INCLUDE_DRAFTS = process.env.GUIDE_INCLUDE_DRAFTS === '1';

export interface CaseItem {
  slug: string;
  /** 상세 페이지·SEO 제목 */
  title: string;
  /** 목록 카드용 짧은 제목 (없으면 title 사용) */
  listTitle: string;
  /** 결과 배지 (네이비) */
  result: string;
  /**
   * 목록 카드용 한 줄 요약 (40~80자 완결 문장, 결과 포함 — success-case-writer가 채운다).
   * 기존 이관 사례에는 없으며, 그 경우 목록은 본문 발췌로 폴백한다 (CASES_LIST_BRIEF 작업 1).
   */
  summary?: string;
  /** 업무분야 8키 + 'etc' — frontmatter field (구 category는 로더에서 정규화) */
  field: CaseField;
  /** field의 표시명 (FIELD_LABELS 공유 소스에서 파생 — 직접 저장하지 않는다) */
  fieldLabel: string;
  /** YYYY-MM-DD — 목록 정렬용 */
  date: string;
  /** 판결문 공개 URL (frontmatter judgment의 상대 경로를 미러 URL로 변환) */
  judgmentUrl?: string;
  /** 'pdf' | 'image' — 문서 카드·라이트박스 렌더 분기 */
  judgmentFormat?: 'pdf' | 'image';
  /** practice 페이지 "이 분야의 성공사례" 우선 노출 (frontmatter featured: true) */
  featured: boolean;
  /**
   * 주제 태그 — 특화 페이지 노출용 (예: "plant").
   * field는 그대로 두고 태그로만 걸리므로, 원 분야 필터에는 영향이 없다.
   */
  tags: string[];
  /** 언더스코어 폴더 = 배포 제외 더미 */
  draft: boolean;
  /** HTML 본문 */
  body: string;
}

/** 콘텐츠 폴더의 상대 자산 경로 → public 미러 URL */
function assetUrl(slugFolder: string, ref?: string): string | undefined {
  if (!ref) return undefined;
  if (/^https?:\/\//.test(ref) || ref.startsWith('/')) return ref;
  return `/content-assets/cases/${slugFolder}/${ref.replace(/^\.\//, '')}`;
}

export function getAllCases(): CaseItem[] {
  if (!fs.existsSync(CASES_DIR)) return [];

  const items: CaseItem[] = [];
  for (const folder of fs.readdirSync(CASES_DIR)) {
    if (!fs.statSync(path.join(CASES_DIR, folder)).isDirectory()) continue;
    const draft = folder.startsWith('_');
    if (draft && !INCLUDE_DRAFTS) continue;

    const file = path.join(CASES_DIR, folder, 'index.md');
    if (!fs.existsSync(file)) continue;
    const parsed = matter(fs.readFileSync(file, 'utf8'));
    const fm = parsed.data as Record<string, unknown>;

    const slug = (fm.slug as string) || folder.replace(/^_/, '');
    const judgment = fm.judgment as string | undefined;
    // field 우선, 잔존 category(한글)는 정규화 폴백 — 미지의 값은 'etc'
    const field =
      normalizeCaseField(fm.field as string | undefined) ??
      normalizeCaseField(fm.category as string | undefined) ??
      'etc';
    items.push({
      slug,
      title: (fm.title as string) || slug,
      listTitle: (fm.list_title as string) || (fm.title as string) || slug,
      result: (fm.result as string) || '',
      summary: (fm.summary as string) || undefined,
      field,
      fieldLabel: CASE_FIELD_LABELS[field],
      date: (fm.date as string) || '',
      judgmentUrl: assetUrl(folder, judgment),
      judgmentFormat: judgment
        ? judgment.toLowerCase().endsWith('.pdf')
          ? 'pdf'
          : 'image'
        : undefined,
      featured: fm.featured === true,
      tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
      draft,
      body: parsed.content.trim(),
    });
  }

  // 날짜 역순 (기존 created_at DESC와 동일)
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export function getCase(slug: string): CaseItem | undefined {
  return getAllCases().find((c) => c.slug === slug);
}

/** 글이 있는 분야만, FIELDS 표시 순서대로 (필터 탭 — 빈 분야 자동 숨김 원칙) */
export function getCaseFields(): CaseField[] {
  const present = new Set(getAllCases().map((c) => c.field));
  return CASE_FIELDS.filter((f) => present.has(f));
}

/**
 * 목록 카드 발췌 (작업 3):
 * - 신규 구조 본문 → .case-stage 첫 문단부터 (.case-brief의 dl 텍스트 제외)
 * - 기존 <p> 본문 → 태그 제거한 전체 텍스트
 */
export function getCaseExcerpt(body: string, maxLen = 90): string {
  // 신규 구조 본문: .case-stage 이후의 첫 문단(<p>)만 — 단계 라벨과 요약 카드 dl은 제외.
  // (블록을 정규식으로 잘라내면 중첩 <div class="stage-label">의 닫는 태그에서 끊기므로
  //  시작 위치부터 슬라이스해 첫 <p>를 찾는다)
  const stageIdx = body.search(/<div[^>]*class="[^"]*case-stage[^"]*"/);
  let source: string;
  if (stageIdx >= 0) {
    const after = body.slice(stageIdx);
    const firstP = after.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    source = firstP ? firstP[1] : after;
  } else if (/case-brief/.test(body)) {
    // 구조 본문인데 stage가 없는 경우 — 요약 카드(dl)만이라도 확실히 제외
    source = body.replace(/<div[^>]*class="[^"]*case-brief[^"]*"[^>]*>[\s\S]*?<\/dl>\s*<\/div>/g, '');
  } else {
    // 기존 이관 본문(<p> 나열)
    source = body;
  }

  const text = source
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text;

  // 가능하면 문장 끝에서 끊는다 — 단어 중간에서 잘린 발췌가 카드의 기존 문제였다
  // (CASES_LIST_BRIEF). 단, 본문에는 "2019.4. 25." 같은 날짜가 흔해 마침표만으로는
  // 문장 끝을 판별할 수 없으므로 앞 글자가 한글인 마침표(…되었습니다.)만 인정한다.
  // 너무 짧아지면(60% 미만) 의미가 남지 않으므로 말줄임으로 폴백.
  const head = text.slice(0, maxLen);
  let cut = -1;
  for (let i = head.length - 1; i >= Math.ceil(maxLen * 0.6); i--) {
    if (head[i] === '.' && /[가-힣]/.test(head[i - 1] ?? '')) {
      cut = i + 1;
      break;
    }
  }
  return cut > 0 ? head.slice(0, cut) : `${head}…`;
}
