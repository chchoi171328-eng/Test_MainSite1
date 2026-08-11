import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Hero } from '../../components/Hero';
import { SituationRouting } from '../../components/SituationRouting';
import { About } from '../../components/About';
import { SuccessCases, CaseCard } from '../../components/SuccessCases';
import { LegalCases } from '../../components/LegalCases';
import { Contact } from '../../components/Contact';
import { getAllCases, getCaseExcerpt } from '../../lib/cases';
import { getAllLegalCases } from '../../api/legalCases';

// Supabase 콘텐츠는 5분 주기 ISR로 재생성
export const revalidate = 300;

export const metadata: Metadata = {
  // 지침 3단계 홈 권장 메타데이터 (템플릿 미적용을 위해 absolute 사용)
  title: {
    absolute: '평택 변호사 최철호 | 부동산·건설·민사소송 | 법무법인 명',
  },
  description:
    '평택 소재 법무법인 명. 최철호 대표변호사가 부동산 분쟁, 건설·공사대금, 대여금·채권, 민사소송, 형사 및 가사 사건을 상담합니다.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const legalCases = await getAllLegalCases().catch(() => []);

  // 성공사례는 파일 기반 (CASE_BOARD_BRIEF 작업 5)
  const successCases: CaseCard[] = getAllCases()
    .slice(0, 3)
    .map((c) => ({
      slug: c.slug,
      listTitle: c.listTitle,
      field: c.field,
      fieldLabel: c.fieldLabel,
      result: c.result,
      // summary가 있으면 그대로, 없는 기존 이관 사례는 본문 발췌로 폴백
      summary: c.summary || getCaseExcerpt(c.body),
      hasJudgment: Boolean(c.judgmentUrl),
    }));

  return (
    <>
      <Hero />
      {/* 상황 라우팅 — 히어로 아래·철학 섹션(About) 위, 홈 전용 (라우팅 지침 작업 1) */}
      <SituationRouting />
      <About />
      <Suspense>
        <SuccessCases cases={successCases} limit={3} />
      </Suspense>
      <LegalCases cases={legalCases} limit={3} />
      <Contact />
    </>
  );
}
