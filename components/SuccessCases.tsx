'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

/** 서버에서 직렬화해 넘기는 카드 데이터 (lib/cases.ts CaseItem의 표시용 부분) */
export interface CaseCard {
  slug: string;
  listTitle: string;
  category: string;
  result: string;
  /**
   * 카드 요약. frontmatter의 summary를 우선 쓰고, 없으면(기존 이관 사례)
   * 본문 첫 문단 발췌로 폴백한다 — 폴백은 .case-brief의 dl 텍스트를 제외하고
   * 서버(getCaseExcerpt)에서 계산한다 (CASES_LIST_BRIEF 작업 1·3)
   */
  summary: string;
  hasJudgment: boolean;
}

interface SuccessCasesProps {
  cases: CaseCard[];
  limit?: number;
  /** 전용 페이지에서 true — 제목은 PageHeader가 담당하므로 컴포넌트 제목을 숨긴다 */
  hideHeading?: boolean;
  /** 전용 페이지에서 true — 분야 필터 칩 표시 (URL 쿼리로 상태 유지) */
  showFilter?: boolean;
}

/** 지시서 5의 표시 순서. 사례가 없는 분야는 칩 자체를 렌더하지 않는다 */
const CATEGORY_ORDER = ['형사', '민사', '가사', '부동산·건설', '기업'];

export const SuccessCases: React.FC<SuccessCasesProps> = ({ cases, limit, hideHeading, showFilter }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = showFilter ? searchParams.get('category') : null;

  const present = new Set(cases.map((c) => c.category).filter(Boolean));
  const categories = [
    ...CATEGORY_ORDER.filter((c) => present.has(c)),
    // 표준 5분야에 없는 값(예: '기타')도 누락 없이 뒤에 붙인다
    ...Array.from(present).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

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
          <div className="cases-filters" role="tablist" aria-label="분야 필터">
            <button role="tab" aria-selected={!activeCategory} onClick={() => selectCategory(null)}>
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => selectCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="cases-grid">
          {displayCases.map((item) => (
            // 카드 전체가 클릭 영역 (지시서 2)
            <Link key={item.slug} href={`/cases/${item.slug}`} className="case-card">
              <div className="cc-badges">
                {/* 결과가 카드의 첫 정보 — 네이비 솔리드 */}
                {item.result && <span className="cc-result">{item.result}</span>}
                {item.category && <span className="cc-cat">{item.category}</span>}
              </div>
              <h3 className="cc-title">{item.listTitle}</h3>
              <p className="cc-sum">{item.summary}</p>
              <div className="cc-foot">
                {/* 판결문이 없는 사례도 푸터 정렬이 유지되도록 빈 span을 둔다 */}
                {item.hasJudgment ? <span className="cc-doc">판결문 마스킹본</span> : <span />}
                <span className="cc-more">자세히 →</span>
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
  );
};
