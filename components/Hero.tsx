import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from './ui';

export const Hero: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/brand/hero-court-view.webp"
          alt="법무법인 명 사무실에서 바라본 평택지원 전경"
          {...{ fetchpriority: 'high' }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/70"></div>
      </div>

      <div className="container relative z-10 px-6 md:px-12 text-center text-white">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 break-keep">
            모든 사건을 <br className="md:hidden" />
            맡지는 않습니다.
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-light mb-6 leading-relaxed break-keep">
            승산 없는 소송은 권하지 않습니다.<br />
            먼저 상황을 듣고, 가능한 결과부터 솔직하게 말씀드립니다.
          </p>
          <p className="text-gray-400 text-sm md:text-base font-light tracking-wide mb-10">
            법무법인 명 · 평택
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigateTo('practice')}
              className="group flex items-center justify-center gap-2"
            >
              <span>업무 분야 보기</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigateTo('contact')}
            >
              30분이면 방향이 보입니다
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator - Hidden since scrolling doesn't navigate pages anymore, or could point to footer */}
      {/* <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </div> */}
    </section>
  );
};