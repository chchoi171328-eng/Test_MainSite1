import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

export const Hero: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/1920/1080?grayscale" 
          alt="Office Interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/70"></div>
      </div>

      <div className="container relative z-10 px-6 md:px-12 text-center text-white">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6">
            승산 없는 소송은 <br className="md:hidden" />
            권하지 않습니다
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-light mb-10 leading-relaxed">
            유리한 점과 불리한 점을 명확히 분석해 최선의 선택을 도와드립니다.<br className="hidden md:block"/>
            법무법인 명의 상담에서 시작하세요.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button 
              onClick={() => navigateTo('practice')}
              className="group px-8 py-4 border border-white/30 hover:bg-white hover:text-brand-dark transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>업무 분야 보기</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigateTo('contact')}
              className="px-8 py-4 bg-brand-gold text-white font-bold hover:bg-white hover:text-brand-gold transition-all duration-300 shadow-lg shadow-brand-gold/20"
            >
              상담 신청
            </button>
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