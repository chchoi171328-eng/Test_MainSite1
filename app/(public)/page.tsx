import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Hero } from '../../components/Hero';
import { About } from '../../components/About';
import { SuccessCases } from '../../components/SuccessCases';
import { LegalCases } from '../../components/LegalCases';
import { Contact } from '../../components/Contact';
import { getAllSuccessCases } from '../../api/successCases';
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
  const [successCases, legalCases] = await Promise.all([
    getAllSuccessCases().catch(() => []),
    getAllLegalCases().catch(() => []),
  ]);

  return (
    <>
      <Hero />
      <About />
      <Suspense>
        <SuccessCases cases={successCases} limit={3} />
      </Suspense>
      <LegalCases cases={legalCases} limit={3} />
      <Contact />
    </>
  );
}
