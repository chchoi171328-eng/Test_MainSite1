/**
 * 전환 이벤트 추적 유틸 (지침 12단계)
 * GA_ID 미설정 또는 gtag 미로드 시 조용히 무시 — 오류를 발생시키지 않는다.
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    try {
      gtag('event', name, params || {});
    } catch {
      // 측정 실패와 관계없이 방문자의 동작을 계속 처리한다.
    }
  }
}

type NaverConversion = { type: 'lead' | 'custom001'; id?: string };
type NaverWindow = Window & {
  wcs_add?: { wa?: string };
  wcs?: { inflow: (domain: string) => void; trans: (event: NaverConversion) => void };
  wcs_do?: () => void;
};

const accountId = process.env.NEXT_PUBLIC_NAVER_CTS_ID;
const pendingConversions: NaverConversion[] = [];
let lastPage: string | undefined;

export function isNaverTrackingSite() {
  return Boolean(accountId) && typeof window !== 'undefined' &&
    ['www.sllaw.co.kr', 'sllaw.co.kr'].includes(window.location.hostname);
}

function sendConversion(w: NaverWindow, event: NaverConversion) {
  try {
    w.wcs!.trans(event);
  } catch {
    // 광고 스크립트 오류가 전화 연결이나 상담 접수에 영향을 주지 않게 한다.
  }
}

export function recordNaverPageView() {
  if (!isNaverTrackingSite()) return;
  const w = window as NaverWindow;
  if (!w.wcs?.inflow || !w.wcs?.trans || !w.wcs_do) return;
  const path = window.location.pathname;
  if (lastPage !== path) {
    try {
      w.wcs_add ??= {};
      w.wcs_add.wa = accountId;
      w.wcs.inflow('sllaw.co.kr');
      w.wcs_do();
      lastPage = path;
    } catch {
      return;
    }
  }
  for (const event of pendingConversions.splice(0)) sendConversion(w, event);
}

export function trackNaverConversion(type: NaverConversion['type'], id?: string) {
  if (!isNaverTrackingSite()) return;
  pendingConversions.push(id ? { type, id } : { type });
  recordNaverPageView();
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
