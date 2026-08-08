import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

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
  /** 형사 | 민사 | 가사 | 부동산·건설 | 기업 | 기타 */
  category: string;
  /** YYYY-MM-DD — 목록 정렬용 */
  date: string;
  /** 판결문 공개 URL (frontmatter judgment의 상대 경로를 미러 URL로 변환) */
  judgmentUrl?: string;
  /** 'pdf' | 'image' — 문서 카드·라이트박스 렌더 분기 */
  judgmentFormat?: 'pdf' | 'image';
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
    items.push({
      slug,
      title: (fm.title as string) || slug,
      listTitle: (fm.list_title as string) || (fm.title as string) || slug,
      result: (fm.result as string) || '',
      category: (fm.category as string) || '기타',
      date: (fm.date as string) || '',
      judgmentUrl: assetUrl(folder, judgment),
      judgmentFormat: judgment
        ? judgment.toLowerCase().endsWith('.pdf')
          ? 'pdf'
          : 'image'
        : undefined,
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

/** 글이 있는 분야만 (필터 탭 — 빈 분야 자동 숨김 원칙) */
export function getCaseCategories(): string[] {
  return Array.from(new Set(getAllCases().map((c) => c.category).filter(Boolean)));
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
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}
