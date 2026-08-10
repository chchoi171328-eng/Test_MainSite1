/**
 * 사이트 전역 상수 — 도메인·색인 정책의 단일 출처 (DOMAIN_LAUNCH_BRIEF A-2)
 *
 * 이전에는 layout / sitemap / robots / organization / 가이드 상세가 각자
 * `process.env.NEXT_PUBLIC_SITE_URL || 'https://test-main-site1.vercel.app'`을
 * 중복 선언했고, 가이드 상세는 아예 임시 도메인을 하드코딩하고 있었다.
 * 도메인이 바뀔 때 한 곳만 고치면 되도록 여기로 모은다.
 */

/** 정식 도메인. 환경변수가 있으면 그것을 쓰고, 없으면 운영 도메인을 기본값으로 한다. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sllaw.co.kr').replace(
  /\/$/,
  ''
);

/** 도메인만 (호스트 비교·리다이렉트 판정용) */
export const SITE_HOST = new URL(SITE_URL).host;

/**
 * 색인 허용 여부.
 *
 * 정식 도메인 연결(2026-08-10) 전에는 `NEXT_PUBLIC_ALLOW_INDEXING === 'true'`인
 * 경우에만 허용하는 옵트인 방식이었다. 이제는 운영 배포가 기본 허용이어야 하므로
 * 옵트아웃으로 뒤집되, 두 가지 안전장치를 둔다.
 *
 * 1. `NEXT_PUBLIC_ALLOW_INDEXING=false`를 명시하면 언제든 다시 차단된다.
 * 2. Vercel preview/development 배포는 자동 차단 — 프리뷰 URL이 색인되면
 *    정식 도메인과 중복 콘텐츠가 된다.
 */
const explicitFlag = process.env.NEXT_PUBLIC_ALLOW_INDEXING;
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV;

export const ALLOW_INDEXING =
  explicitFlag === 'true'
    ? true
    : explicitFlag === 'false'
      ? false
      : // 미설정 시: Vercel 프리뷰가 아니면 허용
        vercelEnv !== 'preview' && vercelEnv !== 'development';
