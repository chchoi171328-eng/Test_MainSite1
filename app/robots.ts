import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://test-main-site1.vercel.app';
const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

export default function robots(): MetadataRoute.Robots {
  // 정식 도메인 연결 전(개발 도메인)에는 전체 수집 차단 (지침 3단계)
  if (!ALLOW_INDEXING) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
