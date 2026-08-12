import type { MetadataRoute } from 'next';
import { getAllCases } from '../lib/cases';
import { getAllForms, getAllPrecedents } from '../lib/resources';
import { FIELDS, getAllGuides, getAllNewsIssues } from '../lib/content';
import { SITE_URL } from '../lib/site';

// 콘텐츠 갱신을 반영하도록 sitemap도 주기 재생성
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/attorneys/choi-cheolho`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/practice`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/fees`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/consultation`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/locations/pyeongtaek`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/cases`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/legal-info`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/news`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/legal-cases`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/legal-forms`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/tools`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/email-policy`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // 업무 분야 상세 8종 — 이 사이트의 최우선 유입 페이지이므로 조건 없이 전부 포함한다.
  // (구판은 검수 완료분만 넣는 필터가 있었고, 검수 등록분이 0건이라 sitemap에서 통째로
  //  빠져 있었다. 정본 8종은 실제 콘텐츠가 있는 정적 라우트라 필터 대상이 아니다.)
  const practicePages: MetadataRoute.Sitemap = FIELDS.map((field) => ({
    url: `${SITE_URL}/practice/${field}`,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));
  staticPages.push(...practicePages);

  // 가이드·소식 — 파일 기반이므로 동기 로드. lastmod는 reviewedAt / publishedAt (지침 작업 8-4)
  const guides = getAllGuides().filter((g) => !g.draft);
  const news = getAllNewsIssues().filter((n) => !n.draft);

  const guidePages: MetadataRoute.Sitemap = [
    // 분야별 가이드 목록 — 해당 분야에 가이드가 있을 때만
    ...FIELDS.filter((f) => guides.some((g) => g.field === f)).map((f) => ({
      url: `${SITE_URL}/guides/${f}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...guides.map((g) => ({
      url: `${SITE_URL}/guides/${g.field}/${g.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      // reviewedAt은 YYYY-MM — 해당 월 1일로 환산
      ...(g.reviewedAt ? { lastModified: new Date(`${g.reviewedAt}-01`) } : {}),
    })),
    ...news.map((n) => ({
      url: `${SITE_URL}/news/${n.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      ...(n.publishedAt ? { lastModified: new Date(n.publishedAt) } : {}),
    })),
  ];
  staticPages.push(...guidePages);

  // 성공사례는 파일 기반 — 빌드 시점에 전 경로 반영 (CASE_BOARD_BRIEF 작업 5)
  const cases = getAllCases();

  // 판례·서식도 파일 기반 (RESOURCES_STATIC_BRIEF)
  const precedents = getAllPrecedents().filter((p) => !p.draft);
  const forms = getAllForms().filter((f) => !f.draft);

  const dynamicPages: MetadataRoute.Sitemap = [
    ...cases.map((c) => ({
      url: `${SITE_URL}/cases/${c.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(c.date ? { lastModified: new Date(c.date) } : {}),
    })),
    ...precedents.map((p) => ({
      url: `${SITE_URL}/legal-cases/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      ...(p.decidedAt ? { lastModified: new Date(p.decidedAt) } : {}),
    })),
    ...forms.map((f) => ({
      url: `${SITE_URL}/legal-forms/${f.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  ];

  return [...staticPages, ...dynamicPages];
}
