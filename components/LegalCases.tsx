import React from 'react';
import { Gavel, Scale, Quote, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNavigation } from '../contexts/NavigationContext';

interface LegalCasesProps {
  limit?: number;
}

export const LegalCases: React.FC<LegalCasesProps> = ({ limit }) => {
  const { legalCases } = useData();
  const { navigateTo } = useNavigation();

  const displayCases = limit ? legalCases.slice(0, limit) : legalCases;

  return (
    <section id="legal-cases" className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Major Precedents</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">주요 판례</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto break-keep">
            법무법인 명이 주목하는 주요 대법원 판례와 법적 쟁점을 소개합니다.<br/>
            판례의 변경은 곧 비즈니스와 생활의 변화를 의미합니다.
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {displayCases.map((item) => (
            <div 
                key={item.id} 
                onClick={() => navigateTo('case-detail', item.id)}
                className="group flex flex-col md:flex-row gap-6 bg-white p-8 rounded-sm border-l-4 border-gray-200 hover:border-brand-gold shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
               <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                     <Scale size={24} />
                  </div>
               </div>
               <div className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                     {item.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-brand-light text-brand-dark px-2 py-1 rounded-sm">
                           {tag}
                        </span>
                     ))}
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-gold transition-colors">
                     {item.title}
                  </h3>
                  <div className="text-xs text-gray-400 mb-4 font-mono flex items-center gap-2">
                     <span>{item.court}</span>
                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                     <span>{item.caseNumber}</span>
                  </div>
                  <div className="relative pl-6">
                     <Quote className="absolute left-0 top-0 text-gray-200 transform -scale-x-100" size={16} />
                     <p className="text-gray-600 text-sm leading-relaxed text-justify line-clamp-3">
                        {item.summary}
                     </p>
                  </div>
               </div>
               <div className="flex-shrink-0 flex items-center">
                   <button className="text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors whitespace-nowrap">
                      판결문 보기 &rarr;
                   </button>
               </div>
            </div>
          ))}
        </div>

        {limit && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => navigateTo('legal-cases')}
              className="inline-flex items-center gap-2 px-8 py-3 border border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all duration-300 rounded-sm"
            >
              판례 더보기 <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};