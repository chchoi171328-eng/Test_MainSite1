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
