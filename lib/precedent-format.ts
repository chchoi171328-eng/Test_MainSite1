/** 판례 표기 유틸 — fs 무의존 (서버·클라이언트 공용) */

/** ("대법원", "2023-07-17") → "대법원 2023. 7. 17. 선고" */
export function formatCourtLine(court: string, decidedAt: string): string {
  const m = decidedAt.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return court;
  return `${court} ${m[1]}. ${Number(m[2])}. ${Number(m[3])}. 선고`;
}
