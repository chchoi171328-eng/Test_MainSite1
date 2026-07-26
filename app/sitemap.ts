import type { MetadataRoute } from 'next';
import { getAllSuccessCases } from '../api/successCases';
import { getAllLegalCases } from '../api/legalCases';
import { PRACTICE_AREA_DEFINITIONS, getReviewedContent } from '../data/practice-areas';
import { FIELDS, getAllGuides, getAllNews } from '../lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://test-main-site1.vercel.app';

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

  // 업무 분야 상세: 검수(reviewedBy) 완료된 콘텐츠만 sitemap에 포함 (noindex 페이지 제외)
  const practicePages: MetadataRoute.Sitemap = PRACTICE_AREA_DEFINITIONS
    .filter((d) => getReviewedContent(d.slug))
    .map((d) => ({
      url: `${SITE_URL}/practice/${d.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  staticPages.push(...practicePages);

  // 가이드·소식 — 파일 기반이므로 동기 로드. lastmod는 reviewedAt / publishedAt (지침 작업 8-4)
  const guides = getAllGuides().filter((g) => !g.draft);
  const news = getAllNews().filter((n) => !n.draft);

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

  // 동적 콘텐츠 — 하나라도 실패해도 sitemap 자체는 생성되도록 개별 처리
  const [cases, legalCases] = await Promise.all([
    getAllSuccessCases().catch(() => []),
    getAllLegalCases().catch(() => []),
  ]);

  const dynamicPages: MetadataRoute.Sitemap = [
    ...cases.map((c) => ({
      url: `${SITE_URL}/cases/${c.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...legalCases.map((c) => ({
      url: `${SITE_URL}/legal-cases/${c.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];

  return [...staticPages, ...dynamicPages];
}
