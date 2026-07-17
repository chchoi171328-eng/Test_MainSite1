import type { Metadata } from 'next';
import { About } from '../../../components/About';

export const metadata: Metadata = {
  title: '법인 소개',
  description:
    '경기도 평택시 소재 법무법인 명(SOL & LUNA). 승산 없는 소송은 권하지 않는 선별 수임 원칙과 최철호 대표변호사를 소개합니다.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-6 md:px-12 pt-10 md:pt-14">
        <h1 className="text-xl md:text-2xl font-serif font-bold text-brand-dark">법인 소개</h1>
        <div className="w-12 h-1 bg-brand-gold mt-3"></div>
      </div>
      <About />
    </div>
  );
}
