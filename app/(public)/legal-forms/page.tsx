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
      {/* 이미지 준비 시: imageSrc="/assets/brand/doc-folder.webp" imageAlt="법률 서식 문서철" */}
      <PageHeader label="Legal Forms" title="법률 서식" />
      <LegalForms forms={forms} />
    </>
  );
}
