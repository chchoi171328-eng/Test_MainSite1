import { SITE_URL } from './organization';

/**
 * 한국식 날짜 문자열("2026. 7. 7.", "2026.07.07", "2026-07-07")을
 * ISO 형식(YYYY-MM-DD)으로 변환. 파싱 불가 시 undefined 반환(필드 생략용).
 */
export function toIsoDate(dateStr: string | undefined | null): string | undefined {
  if (!dateStr) return undefined;
  const m = dateStr.match(/(\d{4})\s*[.\-/]\s*(\d{1,2})\s*[.\-/]\s*(\d{1,2})/);
  if (!m) return undefined;
  const [, y, mo, d] = m;
  const month = mo.padStart(2, '0');
  const day = d.padStart(2, '0');
  return `${y}-${month}-${day}`;
}

/** BreadcrumbList JSON-LD 빌더 — path는 '/'로 시작하는 사이트 내 경로 */
export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
