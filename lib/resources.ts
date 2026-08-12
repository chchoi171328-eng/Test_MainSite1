import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { FIELD_LABELS, isFieldKey, FORM_FIELD_LABELS, isFormField, type FieldKey, type FormField } from './fields';

// 분야 키·표시명의 단일 소스는 lib/fields.ts — 소비처 편의를 위해 재수출
export { FORM_FIELDS, FORM_FIELD_LABELS, isFormField } from './fields';
export type { FormField } from './fields';

/**
 * 법률 서식·주요 판례 로더 (파일 기반, RESOURCES_STATIC_BRIEF)
 * - 성공사례(lib/cases.ts)와 동일 원리: 폴더 1개 = 1건, public 미러로 파일 서빙
 * - 콘텐츠 생산은 legal-form-writer / legal-precedent-writer 스킬 담당
 */

const FORMS_DIR = path.join(process.cwd(), 'content', 'forms');
const PRECEDENTS_DIR = path.join(process.cwd(), 'content', 'precedents');

const INCLUDE_DRAFTS = process.env.GUIDE_INCLUDE_DRAFTS === '1';

export interface FormFile {
  /** 공개 다운로드 URL (public 미러) */
  url: string;
  /** HWP | DOCX | PDF … */
  format: string;
  size?: string;
}

export interface LegalFormItem {
  title: string;
  slug: string;
  field: FormField;
  fieldLabel: string;
  /** 카드 한 줄 — 이관분은 빈 값일 수 있다 (스킬이 순차 작성) */
  summary: string;
  files: FormFile[];
  /** 관련 가이드 slug (발행분만 렌더 — 소비처에서 검증) */
  related: string[];
  updatedAt: string;
  /** 구 Supabase id (기록용) */
  legacyId?: number;
  draft: boolean;
  /** 안내글 HTML (TODO 주석뿐이면 빈 취급) */
  body: string;
}

export interface PrecedentItem {
  title: string;
  slug: string;
  court: string;
  /** YYYY-MM-DD 선고일 */
  decidedAt: string;
  caseNumber: string;
  fields: FieldKey[];
  fieldLabels: string[];
  /** 목록 티저 (사실 요약) */
  summary: string;
  related: string[];
  /** 목록 정렬용 (구 created_at 승계) */
  publishedAt: string;
  legacyId?: number;
  draft: boolean;
  /** 해설 본문 HTML */
  body: string;
}

function readEntry(dir: string, folder: string) {
  const file = path.join(dir, folder, 'index.md');
  if (!fs.existsSync(file)) return null;
  return matter(fs.readFileSync(file, 'utf8'));
}

export function getAllForms(): LegalFormItem[] {
  if (!fs.existsSync(FORMS_DIR)) return [];

  const items: LegalFormItem[] = [];
  for (const folder of fs.readdirSync(FORMS_DIR)) {
    if (!fs.statSync(path.join(FORMS_DIR, folder)).isDirectory()) continue;
    const draft = folder.startsWith('_');
    if (draft && !INCLUDE_DRAFTS) continue;

    const parsed = readEntry(FORMS_DIR, folder);
    if (!parsed) continue;
    const fm = parsed.data as Record<string, unknown>;

    const slug = (fm.slug as string) || folder.replace(/^_/, '');
    const rawFiles = Array.isArray(fm.files) ? (fm.files as Record<string, unknown>[]) : [];
    const files: FormFile[] = rawFiles
      .filter((f) => typeof f.path === 'string')
      .map((f) => ({
        url: `/content-assets/forms/${folder}/${String(f.path).replace(/^\.\//, '')}`,
        format: String(f.format || '').toUpperCase(),
        size: f.size ? String(f.size) : undefined,
      }));
    const field = isFormField(String(fm.field)) ? (fm.field as FormField) : 'common';

    items.push({
      title: (fm.title as string) || slug,
      slug,
      field,
      fieldLabel: FORM_FIELD_LABELS[field],
      summary: (fm.summary as string) || '',
      files,
      related: (fm.related as string[]) || [],
      updatedAt: (fm.updatedAt as string) || '',
      legacyId: typeof fm.legacyId === 'number' ? fm.legacyId : undefined,
      draft,
      body: parsed.content.trim(),
    });
  }

  // 제목 가나다순 (서식은 시점성이 없다)
  return items.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
}

export function getForm(slug: string): LegalFormItem | undefined {
  return getAllForms().find((f) => f.slug === slug);
}

/** 안내글이 실제로 있는지 (TODO 주석만 있는 이관분 구분) */
export function hasFormBody(form: LegalFormItem): boolean {
  return form.body.replace(/<!--[\s\S]*?-->/g, '').trim().length > 0;
}

export function getAllPrecedents(): PrecedentItem[] {
  if (!fs.existsSync(PRECEDENTS_DIR)) return [];

  const items: PrecedentItem[] = [];
  for (const folder of fs.readdirSync(PRECEDENTS_DIR)) {
    if (!fs.statSync(path.join(PRECEDENTS_DIR, folder)).isDirectory()) continue;
    const draft = folder.startsWith('_');
    if (draft && !INCLUDE_DRAFTS) continue;

    const parsed = readEntry(PRECEDENTS_DIR, folder);
    if (!parsed) continue;
    const fm = parsed.data as Record<string, unknown>;

    const slug = (fm.slug as string) || folder.replace(/^_/, '');
    const fields = (Array.isArray(fm.fields) ? (fm.fields as string[]) : []).filter(isFieldKey);

    items.push({
      title: (fm.title as string) || slug,
      slug,
      court: (fm.court as string) || '',
      decidedAt: (fm.decidedAt as string) || '',
      caseNumber: (fm.caseNumber as string) || '',
      fields,
      fieldLabels: fields.map((f) => FIELD_LABELS[f]),
      summary: (fm.summary as string) || '',
      related: (fm.related as string[]) || [],
      publishedAt: (fm.publishedAt as string) || '',
      legacyId: typeof fm.legacyId === 'number' ? fm.legacyId : undefined,
      draft,
      body: parsed.content.trim(),
    });
  }

  // 게시 역순 (구 created_at DESC 승계)
  return items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPrecedent(slug: string): PrecedentItem | undefined {
  return getAllPrecedents().find((p) => p.slug === slug);
}

/** 구 숫자 ID → 새 slug (301 리다이렉트용, docs/redirects-legacy.md 기록) */
export function getPrecedentSlugByLegacyId(id: number): string | undefined {
  return getAllPrecedents().find((p) => p.legacyId === id)?.slug;
}
