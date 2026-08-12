/**
 * 업무분야 8키 단일 소스 — 마스터 플랜 §1과 동일. 순서 = 업무 분야 카드 순서.
 * 가이드(lib/content.ts)와 성공사례(lib/cases.ts)가 모두 이 모듈을 공유한다.
 * fs 의존이 없으므로 클라이언트 컴포넌트에서도 import 가능.
 */

export const FIELDS = [
  'criminal',
  'criminal-victim',
  'civil',
  'divorce',
  'inheritance',
  'real-estate',
  'construction',
  'corporate',
] as const;

export type FieldKey = (typeof FIELDS)[number];

export const FIELD_LABELS: Record<FieldKey, string> = {
  criminal: '형사 변호',
  'criminal-victim': '형사 피해자·고소',
  civil: '민사 소송',
  divorce: '이혼',
  inheritance: '상속',
  'real-estate': '부동산',
  construction: '건설·공사대금',
  corporate: '기업 법무',
};

export function isFieldKey(v: string): v is FieldKey {
  return (FIELDS as readonly string[]).includes(v);
}

/** 사례 분야 = 8키 + 'etc' (8분야에 안 잡히는 사례용) */
export type CaseField = FieldKey | 'etc';

export const CASE_FIELDS: readonly CaseField[] = [...FIELDS, 'etc'];

export const CASE_FIELD_LABELS: Record<CaseField, string> = {
  ...FIELD_LABELS,
  etc: '기타',
};

export function isCaseField(v: string): v is CaseField {
  return v === 'etc' || isFieldKey(v);
}

/**
 * 구 category(한글) → field 키. frontmatter 잔존분과 구 필터 URL
 * (?category=형사 등) 하위호환에 함께 쓴다. '부동산·건설'은 결합
 * 분야였으므로 다수 사례가 속한 construction으로 보낸다.
 */
export const LEGACY_CATEGORY_TO_FIELD: Record<string, CaseField> = {
  형사: 'criminal',
  민사: 'civil',
  가사: 'divorce',
  '부동산·건설': 'construction',
  부동산: 'real-estate',
  건설: 'construction',
  기업: 'corporate',
  기타: 'etc',
};

/** 구 한글 값·현행 키를 모두 받아 CaseField로 정규화. 미지의 값은 null */
export function normalizeCaseField(v: string | null | undefined): CaseField | null {
  if (!v) return null;
  if (isCaseField(v)) return v;
  return LEGACY_CATEGORY_TO_FIELD[v] ?? null;
}

/** 서식 분야 = 8키 + 'common'(분야 공통) — 서식 게시판용 */
export type FormField = FieldKey | 'common';

export const FORM_FIELDS: readonly FormField[] = [...FIELDS, 'common'];

export const FORM_FIELD_LABELS: Record<FormField, string> = {
  ...FIELD_LABELS,
  common: '공통',
};

export function isFormField(v: string): v is FormField {
  return v === 'common' || isFieldKey(v);
}
