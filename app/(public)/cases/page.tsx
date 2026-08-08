import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { SuccessCases, CaseCard } from '../../../components/SuccessCases';
import { getAllCases, getCaseExcerpt } from '../../../lib/cases';

export const metadata: Metadata = {
  title: '성공사례',
  description: '법무법인 명이 수행한 형사·민사·가사 사건의 성공사례를 판결문과 함께 소개합니다.',
  alternates: { canonical: '/cases' },
};

export default function CasesPage() {
  const cards: CaseCard[] = getAllCases().map((c) => ({
    slug: c.slug,
    listTitle: c.listTitle,
    category: c.category,
    result: c.result,
    // summary가 있으면 그대로, 없는 기존 이관 사례는 본문 발췌로 폴백
    summary: c.summary || getCaseExcerpt(c.body),
    hasJudgment: Boolean(c.judgmentUrl),
  }));

  return (
    <>
      <PageHeader
        label="Success Stories"
        title="성공사례"
        subtitle="결과는 판결문으로 보여드립니다."
        imageSrc="/assets/brand/case-records.webp"
        imageAlt="끈으로 묶인 사건 서류 묶음"
      />
      <Suspense>
        <SuccessCases cases={cards} hideHeading showFilter />
      </Suspense>
    </>
  );
}
