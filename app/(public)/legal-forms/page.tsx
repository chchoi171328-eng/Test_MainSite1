import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { LegalForms } from '../../../components/LegalForms';
import { getAllLegalForms } from '../../../api/legalForms';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '법률 서식',
  description: '자주 사용되는 필수 법률 서식을 제공합니다. 다운로드하여 상황에 맞게 수정해 사용하세요.',
  alternates: { canonical: '/legal-forms' },
};

export default async function LegalFormsPage() {
  const forms = await getAllLegalForms().catch(() => []);

  return (
    <>
      <PageHeader
        label="Legal Forms"
        title="법률 서식"
        subtitle="자주 사용되는 필수 법률 서식을 무료로 제공해 드립니다. 다운로드하여 상황에 맞게 수정해 사용하세요."
        imageSrc="/assets/brand/doc-folder.webp"
        imageAlt="만년필이 놓인 서류 폴더"
      />
      <LegalForms forms={forms} />
    </>
  );
}
