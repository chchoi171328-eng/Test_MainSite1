import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowUpRight, ArrowRight, FileCheck } from 'lucide-react';
import { SuccessCase } from '../types';

interface SuccessCasesProps {
  cases: SuccessCase[];
  limit?: number;
  /** 전용 페이지에서 true — 제목은 PageHeader가 담당하므로 컴포넌트 제목을 숨긴다 */
  hideHeading?: boolean;
}

export const SuccessCases: React.FC<SuccessCasesProps> = ({ cases, limit, hideHeading }) => {
  const displayCases = limit ? cases.slice(0, limit) : cases;

  return (
    <section id="success" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {!hideHeading && (
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-dark">성공사례</h2>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {displayCases.map((item) => (
            <Link
              key={item.id}
              href={`/cases/${item.id}`}
              className="block border border-gray-100 p-8 rounded-sm hover:shadow-lg transition-shadow duration-300 relative group overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="mb-4 flex justify-between items-start">
                <span className="text-xs font-bold text-brand-gold uppercase tracking-wider border border-brand-gold/30 px-2 py-1">{item.category}</span>
                <span className="text-brand-dark font-bold flex items-center gap-1 text-sm">
                  <Trophy size={14} className="text-brand-gold" /> {item.result}
                </span>
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-gold transition-colors">{item.title}</h3>
              <div className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.description || '' }} />
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center text-sm font-semibold text-brand-dark group-hover:text-brand-gold transition-colors">
                  자세히 보기 <ArrowUpRight size={16} className="ml-1" />
                </span>
                {item.judgmentUrl && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <FileCheck size={14} /> 판결문 포함
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {limit && (
          <div className="mt-12 text-center">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-8 py-3 border border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all duration-300 rounded-sm"
            >
              성공사례 더보기 <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
