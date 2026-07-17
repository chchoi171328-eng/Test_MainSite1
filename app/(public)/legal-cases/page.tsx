import type { Metadata } from 'next';
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
    <div className="pt-20">
      <LegalCases cases={cases} pageHeading />
    </div>
  );
}
