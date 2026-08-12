import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/brand/hero-court-view.webp"
          alt="법무법인 명 사무실에서 바라본 수원지방법원 평택지원과 수원지방검찰청 평택지청"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* 라디얼(중앙 헤드라인 뒤) + 리니어(상하단 캡션·네비 대비) — hero-final-preview.html 최종 후보 */}
        <div className="absolute inset-0 hero-overlay"></div>
      </div>

      <div className="container relative z-10 px-6 md:px-12 text-center text-white">
        <div className="animate-fade-in-up">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 break-keep"
            style={{ textShadow: '0 2px 22px rgba(10,14,22,.45)' }}
          >
            모든 사건을 <br className="md:hidden" />
            맡지는 않습니다.
          </h1>
          <p
            className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-light mb-6 leading-relaxed break-keep"
            style={{ textShadow: '0 1px 12px rgba(10,14,22,.5)' }}
          >
            승산 없는 소송은 권하지 않습니다.<br />
            먼저 상황을 듣고, 가능한 결과부터 솔직하게 말씀드립니다.
          </p>
          <p className="text-gray-400 text-sm md:text-base font-light tracking-wide mb-10">
            법무법인 명 · 평택
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/practice"
              className="group flex items-center justify-center gap-2 font-bold transition-all duration-300 rounded-sm border border-white/30 text-white hover:bg-white hover:text-brand-dark px-8 py-4 text-lg"
            >
              <span>업무 분야 보기</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/consultation"
              className="flex items-center justify-center font-bold transition-all duration-300 rounded-sm bg-brand-gold text-white hover:bg-yellow-700 shadow-lg hover:shadow-xl hover:scale-105 px-8 py-4 text-lg"
            >
              30분이면 방향이 보입니다
            </Link>
          </div>
        </div>
      </div>

      {/* 사진 설명 캡션 — 좌→우 배치 순서(왼쪽 지청 / 오른쪽 지원)와 일치 */}
      <p className="absolute z-[11] right-[14px] bottom-3 sm:right-5 sm:bottom-4 max-w-[78%] sm:max-w-none text-[10.5px] sm:text-[11.5px] font-light tracking-[.02em] leading-[1.5] text-right text-white/55">
        사무실에서 바라본{' '}
        <br className="sm:hidden" />
        수원지방검찰청 평택지청 · 수원지방법원 평택지원
      </p>
    </section>
  );
};
