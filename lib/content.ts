import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * 가이드·소식 콘텐츠 로더 (MDX 파일 기반, DB 불사용)
 * - 파일 1개 = 글 1편. /content/guides/{field}/{slug}/index.mdx
 * - 언더스코어 prefix 폴더(_sample-guide)는 빌드에서 제외한다 (지침 작업 1)
 *   단, GUIDE_INCLUDE_DRAFTS=1 이면 로컬 렌더 검증용으로 포함한다.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content');
const GUIDES_DIR = path.join(CONTENT_DIR, 'guides');
const NEWS_DIR = path.join(CONTENT_DIR, 'news');

const INCLUDE_DRAFTS = process.env.GUIDE_INCLUDE_DRAFTS === '1';

/** 8분야 키 단일 소스는 lib/fields.ts — 가이드·성공사례가 공유. 기존 소비처를 위해 재수출 */
export { FIELDS, FIELD_LABELS, isFieldKey } from './fields';
export type { FieldKey } from './fields';
import { FIELDS, isFieldKey, type FieldKey } from './fields';

export interface Guide {
  listingTitle: string;
  title: string;
  slug: string;
  field: FieldKey;
  summary: string;
  metaDescription: string;
  keywords: string[];
  /** YYYY-MM. 발행일은 두지 않는다 */
  reviewedAt: string;
  author: string;
  /** frontmatter의 상대 경로(./thumbnail.jpg)를 public 기준 URL로 변환한 값 */
  thumbnail?: string;
  /** 분야 내 발행 순번 — 목록 정렬 기준. 없으면 뒤로 밀린다 */
  order: number;
  related: string[];
  tools: string[];
  /** 세부 페이지 §9에서 우선 노출 */
  featured: boolean;
  /**
   * 변호사 검수 게이트 (frontmatter approved, 기본 false).
   * true인 가이드만 sitemap에 포함되고 색인이 허용된다 — false면 페이지는
   * 접근 가능하되 noindex. 검수 완료 시점에 frontmatter에 approved: true를 단다.
   */
  approved: boolean;
  /** 언더스코어 폴더 = 배포 제외 더미 */
  draft: boolean;
  body: string;
}

/**
 * 소식 = 주간호 구조 (NEWS_BOARD_BRIEF). 게시판 하나, 주 1편,
 * 한 편 안에 지난주의 법령 제·개정·판결 요약을 나열한다.
 * 항목별 상세 페이지는 없다. 콘텐츠 생산은 legal-news-writer 스킬.
 */
export type NewsItemCategory = 'law' | 'enforce' | 'ruling' | 'office';

/** 주간호 본문 뱃지 표시명 */
export const NEWS_CATEGORY_LABELS: Record<NewsItemCategory, string> = {
  law: '법령 개정',
  enforce: '시행',
  ruling: '판결',
  office: '사무소',
};

/** 목록 미리보기 미니 태그 표시명 */
export const NEWS_CATEGORY_SHORT: Record<NewsItemCategory, string> = {
  law: '개정',
  enforce: '시행',
  ruling: '판결',
  office: '사무소',
};

export function isNewsItemCategory(v: string): v is NewsItemCategory {
  return v === 'law' || v === 'enforce' || v === 'ruling' || v === 'office';
}

/** frontmatter items[] — 목록 미리보기·메타 (본문 항목 블록과 순서 일치) */
export interface NewsIssueItemMeta {
  category: NewsItemCategory;
  /** 8분야 키 (복수 가능, 없으면 []) */
  fields: FieldKey[];
  title: string;
}

export interface NewsIssue {
  /** 예: "8월 첫째 주 — 임대차 표준계약서 고시 개정 외 3건" */
  title: string;
  /** 발행일 기반 (예: "2026-08-10") */
  slug: string;
  publishedAt: string;
  /** 다루는 기간 */
  periodStart: string;
  periodEnd: string;
  items: NewsIssueItemMeta[];
  draft: boolean;
  /** HTML 항목 블록 나열 (.news-item 반복) — 시각 정본 news-preview.html 시안 B */
  body: string;
}

function readEntry(dir: string, folder: string) {
  const file = path.join(dir, folder, 'index.mdx');
  if (!fs.existsSync(file)) return null;
  return matter(fs.readFileSync(file, 'utf8'));
}

/**
 * 콘텐츠 폴더 안의 상대 이미지 경로를 배포 URL로 바꾼다.
 * /content는 public이 아니므로, 이미지는 /public/content-assets/ 로 미러링해 사용한다.
 */
function assetUrl(kind: 'guides' | 'news', segments: string[], ref?: string) {
  if (!ref) return undefined;
  if (/^https?:\/\//.test(ref) || ref.startsWith('/')) return ref;
  return `/content-assets/${kind}/${segments.join('/')}/${ref.replace(/^\.\//, '')}`;
}

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  const guides: Guide[] = [];
  for (const field of FIELDS) {
    const fieldDir = path.join(GUIDES_DIR, field);
    if (!fs.existsSync(fieldDir)) continue;

    for (const folder of fs.readdirSync(fieldDir)) {
      if (!fs.statSync(path.join(fieldDir, folder)).isDirectory()) continue;
      const draft = folder.startsWith('_');
      if (draft && !INCLUDE_DRAFTS) continue;

      const parsed = readEntry(fieldDir, folder);
      if (!parsed) continue;
      const fm = parsed.data as Record<string, unknown>;

      const slug = (fm.slug as string) || folder.replace(/^_/, '');
      guides.push({
        listingTitle: (fm.listingTitle as string) || (fm.title as string) || slug,
        title: (fm.title as string) || slug,
        slug,
        field,
        summary: (fm.summary as string) || '',
        metaDescription: (fm.metaDescription as string) || (fm.summary as string) || '',
        keywords: (fm.keywords as string[]) || [],
        reviewedAt: (fm.reviewedAt as string) || '',
        author: (fm.author as string) || '최철호',
        thumbnail: assetUrl('guides', [field, folder], fm.thumbnail as string | undefined),
        order: typeof fm.order === 'number' ? fm.order : Number.MAX_SAFE_INTEGER,
        related: (fm.related as string[]) || [],
        tools: (fm.tools as string[]) || [],
        featured: fm.featured === true,
        approved: fm.approved === true,
        draft,
        body: parsed.content,
      });
    }
  }

  // 분야 내 발행 순번(order) 오름차순, 순번이 없으면 검토일 최신순으로 뒤에
  return guides.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return b.reviewedAt.localeCompare(a.reviewedAt);
  });
}

export function getGuidesByField(field: FieldKey): Guide[] {
  return getAllGuides().filter((g) => g.field === field);
}

export function getGuide(field: string, slug: string): Guide | undefined {
  return getAllGuides().find((g) => g.field === field && g.slug === slug);
}

/**
 * 세부 페이지 §9용 — 해당 분야 가이드 (featured 우선, 그다음 검토일 최신순)
 * 더미(draft)는 포함하지 않는다.
 */
export function getGuidesForPractice(field: FieldKey, limit = 4): Guide[] {
  return getAllGuides()
    .filter((g) => g.field === field && !g.draft)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.order !== b.order) return a.order - b.order;
      return b.reviewedAt.localeCompare(a.reviewedAt);
    })
    .slice(0, limit);
}

export function getAllNewsIssues(): NewsIssue[] {
  if (!fs.existsSync(NEWS_DIR)) return [];

  const issues: NewsIssue[] = [];
  for (const folder of fs.readdirSync(NEWS_DIR)) {
    if (!fs.statSync(path.join(NEWS_DIR, folder)).isDirectory()) continue;
    const draft = folder.startsWith('_');
    if (draft && !INCLUDE_DRAFTS) continue;

    const parsed = readEntry(NEWS_DIR, folder);
    if (!parsed) continue;
    const fm = parsed.data as Record<string, unknown>;

    const rawItems = Array.isArray(fm.items) ? (fm.items as Record<string, unknown>[]) : [];
    const items: NewsIssueItemMeta[] = rawItems.map((it) => ({
      category: isNewsItemCategory(String(it.category)) ? (it.category as NewsItemCategory) : 'office',
      fields: (Array.isArray(it.fields) ? (it.fields as string[]) : []).filter(isFieldKey),
      title: String(it.title || ''),
    }));

    issues.push({
      title: (fm.title as string) || folder,
      slug: (fm.slug as string) || folder.replace(/^_/, ''),
      publishedAt: (fm.publishedAt as string) || '',
      periodStart: (fm.periodStart as string) || '',
      periodEnd: (fm.periodEnd as string) || '',
      items,
      draft,
      body: parsed.content,
    });
  }

  // 발행일 역순
  return issues.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNewsIssue(slug: string): NewsIssue | undefined {
  return getAllNewsIssues().find((n) => n.slug === slug);
}

/**
 * 주간호 본문의 관련 가이드 링크를 발행된 가이드로만 제한한다 (지시서 3절 — 깨진 링크 금지).
 * - /guides/{field}/{slug} 앵커 중 발행본이 없는 것은 앵커째 제거
 * - .iguide 블록에 남는 앵커가 없으면 블록 전체를 제거
 * - 앵커 사이 " · " 구분자는 재조립해 잔여물이 남지 않게 한다
 */
export function validateNewsGuideLinks(body: string): string {
  const published = new Set(
    getAllGuides()
      .filter((g) => !g.draft)
      .map((g) => `${g.field}/${g.slug}`),
  );

  return body.replace(
    /<div class="iguide">([\s\S]*?)<\/div>/g,
    (whole, inner: string) => {
      const label = inner.match(/<span class="lb">[\s\S]*?<\/span>/)?.[0] ?? '<span class="lb">관련 가이드</span>';
      const anchors: string[] = [];
      const anchorRe = /<a\s+href="\/guides\/([a-z-]+)\/([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/g;
      let m: RegExpExecArray | null;
      while ((m = anchorRe.exec(inner)) !== null) {
        if (published.has(`${m[1]}/${m[2]}`)) anchors.push(m[0]);
      }
      if (anchors.length === 0) return '';
      return `<div class="iguide">${label}${anchors.join(' · ')}</div>`;
    },
  );
}

/** "2026-07" → "2026년 7월" */
export function formatReviewedAt(reviewedAt: string): string {
  const m = reviewedAt.match(/^(\d{4})-(\d{1,2})$/);
  if (!m) return reviewedAt;
  return `${m[1]}년 ${Number(m[2])}월`;
}

/** "2026-07-24" → "2026. 7. 24." */
export function formatPublishedAt(publishedAt: string): string {
  const m = publishedAt.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return publishedAt;
  return `${m[1]}. ${Number(m[2])}. ${Number(m[3])}.`;
}

/** "2026-08-10" → "8. 10." (주간호 목록 좌열 — 연도는 그룹 라벨이 담당) */
export function formatIssueDay(publishedAt: string): string {
  const m = publishedAt.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return publishedAt;
  return `${Number(m[2])}. ${Number(m[3])}.`;
}

/** 다루는 기간 — "2026. 8. 3. ~ 8. 9." (연도가 같으면 끝 날짜의 연도 생략) */
export function formatPeriodRange(start: string, end: string): string {
  const s = start.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const e = end.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!s || !e) return `${start} ~ ${end}`;
  const from = `${s[1]}. ${Number(s[2])}. ${Number(s[3])}.`;
  const to =
    s[1] === e[1] ? `${Number(e[2])}. ${Number(e[3])}.` : `${e[1]}. ${Number(e[2])}. ${Number(e[3])}.`;
  return `${from} ~ ${to}`;
}

/**
 * 목차용 H2 추출 — MDX 본문에서 직접 파싱한다.
 * remark-heading-id의 `{#id}` 문법을 지원하며, 없으면 순번 앵커(s1, s2…)를 부여한다.
 * ※ 헤딩 ID 생성 규칙을 렌더러와 공유해야 목차 앵커가 어긋나지 않는다 (지침 작업 4 주의사항)
 */
/** 목차에서 제외하는 고정 섹션 제목 (표준 3-2 — FAQ·안내·CTA는 제외) */
const TOC_EXCLUDED = ['자주 묻는 질문', '법률 정보 안내', '함께 보면 좋은 자료'];

export function extractToc(body: string): { id: string; text: string }[] {
  const toc: { id: string; text: string }[] = [];
  let auto = 0;

  // 코드블록 안의 ## 는 제외 (withHeadingIds와 동일한 대상만 센다)
  const withoutCode = body.replace(/```[\s\S]*?```/g, '');

  for (const line of withoutCode.split('\n')) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (!m) continue;

    // auto 번호는 withHeadingIds와 동일하게 모든 H2에 대해 증가시킨다 (ID 일치 보장)
    auto += 1;
    const raw = m[1];
    const idMatch = raw.match(/\{#([\w-]+)\}\s*$/);
    const text = raw.replace(/\{#[\w-]+\}\s*$/, '').trim();
    if (TOC_EXCLUDED.includes(text)) continue;
    toc.push({ id: idMatch ? idMatch[1] : `s${auto}`, text });
  }
  return toc;
}

/**
 * H2를 명시적 id를 가진 HTML 헤딩으로 변환한다.
 *
 * MDX는 `## 제목 {#id}` 의 중괄호를 JSX 표현식으로 파싱해 실패하므로,
 * 컴파일 전에 `<h2 id="...">제목</h2>` 로 바꿔 둔다.
 * ID 결정 규칙을 extractToc()과 공유하므로 목차 앵커와 반드시 일치한다.
 * (지침 작업 4 주의사항 — 목차 앵커 = 헤딩 자동 ID)
 */
export function withHeadingIds(body: string): string {
  let auto = 0;
  let num = 0;
  let inCode = false;

  return body
    .split('\n')
    .map((line) => {
      if (/^```/.test(line.trim())) {
        inCode = !inCode;
        return line;
      }
      if (inCode) return line;

      const m = line.match(/^##\s+(.+?)\s*$/);
      if (!m) return line;

      auto += 1;
      const raw = m[1];
      const idMatch = raw.match(/\{#([\w-]+)\}\s*$/);
      const id = idMatch ? idMatch[1] : `s${auto}`;
      const text = raw.replace(/\{#[\w-]+\}\s*$/, '').trim();
      // 원시 <h2> 태그는 MDX components 매핑을 타지 않으므로(스타일 미적용)
      // 커스텀 컴포넌트로 변환한다. 목차에 오르는 H2에는 목차와 같은 순번(num)을 부여
      const numAttr = TOC_EXCLUDED.includes(text) ? '' : ` num="${(num += 1)}"`;
      return `<GuideH2 id="${id}"${numAttr}>${text}</GuideH2>`;
    })
    .join('\n');
}
