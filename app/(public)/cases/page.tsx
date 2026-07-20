import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { SuccessCases } from '../../../components/SuccessCases';
import { getAllSuccessCases } from '../../../api/successCases';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '성공사례',
  description: '법무법인 명이 수행한 형사·민사·가사 사건의 성공사례를 판결문과 함께 소개합니다.',
  alternates: { canonical: '/cases' },
};

export default async function CasesPage() {
  const cases = await getAllSuccessCases().catch(() => []);

  return (
    <>
      {/* 이미지 준비 시: imageSrc="/assets/brand/case-records.webp" imageAlt="판결문 기록" */}
      <PageHeader
        label="Success Stories"
        title="성공사례"
        subtitle="결과는 판결문으로 보여드립니다."
      />
      <SuccessCases cases={cases} hideHeading />
    </>
  );
}
