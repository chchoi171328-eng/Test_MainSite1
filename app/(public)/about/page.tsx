import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { About } from '../../../components/About';

export const metadata: Metadata = {
  title: '법인 소개',
  description:
    '경기도 평택시 소재 법무법인 명(SOL & LUNA). 승산 없는 소송은 권하지 않는 선별 수임 원칙과 최철호 대표변호사를 소개합니다.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      {/* 이미지 준비 시: imageSrc="/assets/brand/office-light.webp" imageAlt="법무법인 명 사무 공간" */}
      <PageHeader
        label="About Us"
        title="법인 소개"
        subtitle="먼저 듣고, 솔직하게 말씀드립니다."
      />
      <About />
    </>
  );
}
