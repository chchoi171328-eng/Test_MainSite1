import React from 'react';
import { Stat } from '../types';

const STATS: Stat[] = [
  { value: "Construction", label: "업무 분야" },
  { value: "Risk Check", label: "선임 전 절차" },
  { value: "Honesty", label: "핵심 가치" },
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Existing Philosophy Section */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-32">
          <div className="relative mb-8 md:mb-0 px-4 md:px-0">
             <div className="absolute -top-4 -left-0 md:-left-4 w-16 h-16 md:w-24 md:h-24 border-t-2 border-l-2 border-brand-gold"></div>
             <img 
               src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
               alt="Law books and scales" 
               className="w-full h-64 md:h-[500px] object-cover shadow-2xl filter grayscale contrast-125"
             />
             <div className="absolute -bottom-4 -right-0 md:-right-4 w-16 h-16 md:w-24 md:h-24 border-b-2 border-r-2 border-brand-gold"></div>
          </div>
          
          <div>
            <span className="text-brand-gold font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">Our Philosophy</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-dark mb-6 md:mb-8 leading-snug break-keep">
              '이겨드립니다'라는 말은 쉽습니다.<br />
              대신 책임지기는 어렵습니다.
            </h2>
            <div className="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-base md:text-lg break-keep">
              <p>
                저희 사무실은 공사·부동산 소송에서 <strong>승소 가능성보다 실익을 먼저 판단</strong>합니다.
                판결을 받아도 실제로 돈을 받을 수 있는지, 감정 비용이 결과를 뒤집지는 않는지, 
                일부 승소로 끝날 위험은 없는지 철저히 계산합니다.
              </p>
              <p>
                그래서 때로는 소송을 말리고, 선임을 거절합니다.
                <br />
                그것이 의뢰인에게 가장 안전한 선택인 경우가 많기 때문입니다.
              </p>
              <p className="font-bold text-brand-dark">
                잘못 시작한 소송은 변호사도, 의뢰인도 되돌릴 수 없습니다.
                시작하지 말아야 할 소송을 말릴 수 있는 변호사가 장기적으로 살아남습니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-gray-100 pt-8 mt-8 md:mt-10">
              {STATS.map((stat, idx) => (
                <div key={idx} className="text-center md:text-left">
                  <p className="text-lg md:text-3xl font-serif font-bold text-brand-gold mb-1 break-keep">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Representative Lawyer Section */}
        <div className="grid md:grid-cols-12 gap-12 items-start pt-16 border-t border-gray-100">
          {/* Image & Profile */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="relative mb-8 group">
               <img 
                 src="https://images.unsplash.com/photo-1558222218-b7b54eede3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                 alt="최철호 대표변호사" 
                 className="w-full h-auto object-cover shadow-lg filter grayscale group-hover:grayscale-0 transition-all duration-500"
               />
               <div className="absolute bottom-0 left-0 bg-brand-dark text-white p-4 w-full">
                  <p className="font-serif font-bold text-xl">최철호</p>
                  <p className="text-xs text-brand-gold uppercase tracking-wider">Representative Attorney</p>
               </div>
            </div>
            
            <div className="space-y-6 text-sm text-gray-600 bg-gray-50 p-6 rounded-sm">
               <div>
                  <h4 className="font-bold text-brand-dark mb-2 border-b border-gray-200 pb-2">학력</h4>
                  <ul className="space-y-1 text-xs md:text-sm">
                     <li>중앙대학교 컴퓨터공학과</li>
                     <li>성균관대학교 법학전문대학원</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-brand-dark mb-2 border-b border-gray-200 pb-2">경력</h4>
                  <ul className="space-y-1 text-xs md:text-sm">
                     <li>(현) 법무법인 명 대표변호사</li>
                     <li>(전) 법무법인 수호 변호사</li>
                     <li>(전) GS건설 사내변호사</li>
                     <li>(전) 롯데건설 사내변호사</li>
                     <li>(전) 서울고등법원 실무수습</li>
                     <li>(전) 서울북부지방법원 실무수습</li>
                  </ul>
               </div>
            </div>
          </div>

          {/* Greeting Text */}
          <div className="md:col-span-8 lg:col-span-8 md:pl-8">
             <span className="text-brand-gold font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">Representative Message</span>
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-8 leading-snug break-keep">
               "의뢰인의 이익을 최우선으로,<br/>
               끝까지 책임지는 변호사가 되겠습니다."
             </h2>
             <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed break-keep">
               <p>
                 안녕하십니까. 법무법인 명(SOL & LUNA)의 대표변호사 최철호입니다.
               </p>
               <p>
                 법무법인 명은 복잡하고 어려운 법적 분쟁 속에서 의뢰인에게 가장 명확하고 실질적인 해결책을 제시하기 위해 설립되었습니다. 
                 특히 건설 및 부동산 분야는 수많은 이해관계와 기술적 쟁점이 얽혀 있어, 단순한 법리 적용만으로는 해결하기 어려운 경우가 많습니다.
               </p>
               <p>
                 저는 대형 건설사 사내변호사로 근무하며 현장에서 발생하는 다양한 분쟁을 직접 경험하고 해결해왔습니다. 
                 이러한 실무 경험을 바탕으로, 우리 법인은 소송의 승패를 넘어 의뢰인의 비즈니스와 삶에 실질적인 도움이 되는 결과를 만들어내는 것을 목표로 합니다.
               </p>
               <p>
                 무리한 소송을 권유하지 않겠습니다. 듣기 좋은 말보다 뼈아픈 조언이 필요할 때 주저하지 않겠습니다. 
                 의뢰인의 소중한 자산과 권리를 지키기 위해, 저희 법무법인 명의 모든 구성원이 한 팀이 되어 치열하게 고민하고 싸우겠습니다.
               </p>
               <p>
                 감사합니다.
               </p>
               <div className="mt-8 pt-8 text-right">
                  <p className="font-serif font-bold text-brand-dark text-xl">대표변호사 최철호 올림</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};