/**
 * 전환 이벤트 추적 유틸 (지침 12단계)
 * GA_ID 미설정 또는 gtag 미로드 시 조용히 무시 — 오류를 발생시키지 않는다.
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', name, params || {});
  }
}

interface NaverWcs {
  trans?: (opts: { type: string }) => void;
}

/**
 * 네이버 CTS 전환 발화 (NAVER_CTS_BRIEF A-2).
 * 스크립트 미로드 또는 AccountId 미설정이면 조용히 무시한다 — GA와 동일 패턴.
 * CTS 스크립트가 나중에 도입되어도 이 함수 하나로 전 지점이 함께 동작한다.
 */
export function trackNaverConversion(type: 'lead' | 'custom001') {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { wcs?: NaverWcs; wcs_add?: Record<string, string> };
  const accountId = process.env.NEXT_PUBLIC_NAVER_CTS_ID;
  if (!accountId || !w.wcs || typeof w.wcs.trans !== 'function') return;
  if (!w.wcs_add) w.wcs_add = {};
  w.wcs_add['wa'] = accountId;
  w.wcs.trans({ type });
}

/**
 * 전화 클릭 단일 핸들러 (GOOGLE_ADS_CONVERSION_BRIEF A-1).
 * 사이트의 모든 tel: 링크는 이 함수를 거친다 — GA4 call_click과 네이버 CTS
 * custom001이 같은 지점에서 나란히 발화한다 (중복 구현 금지).
 *
 * @param location 클릭이 일어난 UI 지점 (action_bar, footer, practice_cta 등)
 */
export function trackCallClick(location: string) {
  trackEvent('call_click', {
    event_category: 'contact',
    // 어느 페이지에서 걸었는지 — Google Ads 전환 분석의 기준 축
    event_label: typeof window !== 'undefined' ? window.location.pathname : '',
    // 어느 UI 지점에서 걸었는지 (기존 배선에서 이어받은 축)
    location,
  });
  trackNaverConversion('custom001');
}
