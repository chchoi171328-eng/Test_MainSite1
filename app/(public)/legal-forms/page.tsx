import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { LegalForms, FormCard } from '../../../components/LegalForms';
import { getAllForms } from '../../../lib/resources';

export const metadata: Metadata = {
  title: '법률 서식',
  description: '자주 사용되는 필수 법률 서식을 제공합니다. 다운로드하여 상황에 맞게 수정해 사용하세요.',
  alternates: { canonical: '/legal-forms' },
};

export default function LegalFormsPage() {
  const cards: FormCard[] = getAllForms()
    .filter((f) => !f.draft)
    .map((f) => ({
      title: f.title,
      slug: f.slug,
      field: f.field,
      fieldLabel: f.fieldLabel,
      summary: f.summary,
      files: f.files,
    }));

  return (
    <>
      <PageHeader
        label="Legal Forms"
        title="법률 서식"
        subtitle="자주 사용되는 필수 법률 서식을 무료로 제공해 드립니다. 다운로드하여 상황에 맞게 수정해 사용하세요."
        imageSrc="/assets/brand/doc-folder.webp"
        imageAlt="만년필이 놓인 서류 폴더"
      />
      <LegalForms forms={cards} />
    </>
  );
}
