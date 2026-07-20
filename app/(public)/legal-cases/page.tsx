import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { LegalCases } from '../../../components/LegalCases';
import { getAllLegalCases } from '../../../api/legalCases';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '주요 판례',
  description: '법무법인 명이 주목하는 주요 대법원 판례와 법적 쟁점을 소개합니다.',
  alternates: { canonical: '/legal-cases' },
};

export default async function LegalCasesPage() {
  const cases = await getAllLegalCases().catch(() => []);

  return (
    <>
      <PageHeader
        label="Major Precedents"
        title="주요 판례"
        subtitle="법무법인 명이 주목하는 주요 대법원 판례와 법적 쟁점을 소개합니다. 판례의 변경은 곧 비즈니스와 생활의 변화를 의미합니다."
        imageSrc="/assets/brand/book-stack.webp"
        imageAlt="책상 위에 쌓인 법률 서적"
      />
      <LegalCases cases={cases} hideHeadingTitle />
    </>
  );
}
