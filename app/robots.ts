import type { MetadataRoute } from 'next';
import { SITE_URL, ALLOW_INDEXING } from '../lib/site';

export default function robots(): MetadataRoute.Robots {
  // 프리뷰 배포나 명시적 차단 설정에서는 전체 수집 차단 (lib/site.ts ALLOW_INDEXING 참조)
  if (!ALLOW_INDEXING) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 관리자 화면과 내부 API는 색인 대상이 아니다
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
