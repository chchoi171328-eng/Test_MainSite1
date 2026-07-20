import React from 'react';
import Link from 'next/link';
import { Quote, ArrowRight } from 'lucide-react';
import { LegalCase } from '../types';

interface LegalCasesProps {
  cases: LegalCase[];
  limit?: number;
  /** 전용 페이지에서 true — 제목·설명 문구는 PageHeader가 담당하므로 컴포넌트 헤딩 전체를 숨긴다 */
  hideHeadingTitle?: boolean;
}

export const LegalCases: React.FC<LegalCasesProps> = ({ cases, limit, hideHeadingTitle }) => {
  const displayCases = limit ? cases.slice(0, limit) : cases;

  return (
    <section id="legal-cases" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {!hideHeadingTitle && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">주요 판례</h2>
            <p className="text-gray-500 max-w-2xl mx-auto break-keep">
              법무법인 명이 주목하는 주요 대법원 판례와 법적 쟁점을 소개합니다.<br />
              판례의 변경은 곧 비즈니스와 생활의 변화를 의미합니다.
            </p>
          </div>
        )}

        <div className="space-y-8 max-w-4xl mx-auto">
          {displayCases.map((item) => (
            <Link
              key={item.id}
              href={`/legal-cases/${item.id}`}
              className="group flex flex-col md:flex-row gap-6 bg-white p-8 rounded-sm border-l-4 border-gray-200 hover:border-brand-gold shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {(item.tags || []).map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-brand-light text-brand-dark px-2 py-1 rounded-sm">
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-gray-400 font-mono flex items-center gap-2">
                    <span>{item.court}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{item.caseNumber}</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-3 line-clamp-2 break-keep group-hover:text-brand-gold transition-colors">
                  {item.listTitle || item.title}
                </h3>
                {item.summary && (
                  <div className="relative pl-6">
                    <Quote className="absolute left-0 top-0 text-gray-200 transform -scale-x-100" size={16} />
                    <p className="text-gray-500 text-sm leading-relaxed text-left line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center">
                <span className="text-sm font-bold text-gray-400 group-hover:text-brand-dark transition-colors whitespace-nowrap">
                  내용 보기 &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {limit && (
          <div className="mt-12 text-center">
            <Link
              href="/legal-cases"
              className="inline-flex items-center gap-2 px-8 py-3 border border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all duration-300 rounded-sm"
            >
              판례 더보기 <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
