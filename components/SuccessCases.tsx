'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, ArrowRight, FileCheck } from 'lucide-react';

/** 서버에서 직렬화해 넘기는 카드 데이터 (lib/cases.ts CaseItem의 표시용 부분) */
export interface CaseCard {
  slug: string;
  listTitle: string;
  category: string;
  result: string;
  /** 목록 발췌 — .case-brief의 dl 텍스트를 제외하고 서버에서 계산 (작업 3) */
  excerpt: string;
  hasJudgment: boolean;
}

interface SuccessCasesProps {
  cases: CaseCard[];
  limit?: number;
  /** 전용 페이지에서 true — 제목은 PageHeader가 담당하므로 컴포넌트 제목을 숨긴다 */
  hideHeading?: boolean;
  /** 전용 페이지에서 true — 분야 필터 탭 표시 (URL 쿼리로 상태 유지) */
  showFilter?: boolean;
}

export const SuccessCases: React.FC<SuccessCasesProps> = ({ cases, limit, hideHeading, showFilter }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = showFilter ? searchParams.get('category') : null;

  const categories = Array.from(new Set(cases.map((c) => c.category).filter(Boolean)));
  const filtered = activeCategory ? cases.filter((c) => c.category === activeCategory) : cases;
  const displayCases = limit ? filtered.slice(0, limit) : filtered;

  const selectCategory = (category: string | null) => {
    router.replace(category ? `/cases?category=${encodeURIComponent(category)}` : '/cases', {
      scroll: false,
    });
  };

  return (
    <section id="success" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {!hideHeading && (
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-dark">성공사례</h2>
          </div>
        )}

        {showFilter && categories.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="분야 필터">
            <button
              role="tab"
              aria-selected={!activeCategory}
              onClick={() => selectCategory(null)}
              className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
                !activeCategory
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => selectCategory(category)}
                className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
                  activeCategory === category
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {displayCases.map((item) => (
            <Link
              key={item.slug}
              href={`/cases/${item.slug}`}
              className="block border border-gray-100 p-8 rounded-sm hover:shadow-lg transition-shadow duration-300 relative group overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider border border-gray-200 px-2 py-1">{item.category}</span>
                {item.result && (
                  <span className="text-sm font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/40 px-3 py-1 rounded-sm">
                    {item.result}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-3 line-clamp-2 break-keep group-hover:text-brand-gold transition-colors">
                {item.listTitle}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 break-keep">
                {item.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center text-sm font-semibold text-brand-dark group-hover:text-brand-gold transition-colors">
                  자세히 보기 <ArrowUpRight size={16} className="ml-1" />
                </span>
                {item.hasJudgment && (
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
