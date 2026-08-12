'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
// fs를 쓰는 lib/cases.ts가 아니라 클라이언트 안전한 단일 소스 lib/fields.ts에서 가져온다
import {
  CASE_FIELDS,
  CASE_FIELD_LABELS,
  normalizeCaseField,
  type CaseField,
} from '../lib/fields';

/** 서버에서 직렬화해 넘기는 카드 데이터 (lib/cases.ts CaseItem의 표시용 부분) */
export interface CaseCard {
  slug: string;
  listTitle: string;
  /** 업무분야 키 (lib/cases.ts CaseField) */
  field: CaseField;
  /** field 표시명 — FIELD_LABELS 공유 소스에서 서버가 파생 */
  fieldLabel: string;
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

export const SuccessCases: React.FC<SuccessCasesProps> = ({ cases, limit, hideHeading, showFilter }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ?field=분야키 정본. 구 링크(?category=형사, ?category=부동산·건설 등)도
  // normalizeCaseField로 받아 깨지지 않게 한다 — 미지의 값은 필터 없음으로 처리.
  const rawParam = showFilter ? searchParams.get('field') ?? searchParams.get('category') : null;
  const activeField = normalizeCaseField(rawParam);

  // 8분야 키 순서(가이드와 동일) + 기타 — 사례가 없는 분야는 칩 자체를 렌더하지 않는다
  const present = new Set(cases.map((c) => c.field));
  const fields = CASE_FIELDS.filter((f) => present.has(f));

  const filtered = activeField ? cases.filter((c) => c.field === activeField) : cases;
  const displayCases = limit ? filtered.slice(0, limit) : filtered;

  const selectField = (field: CaseField | null) => {
    router.replace(field ? `/cases?field=${encodeURIComponent(field)}` : '/cases', {
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

        {showFilter && fields.length > 1 && (
          <div className="cases-filters" role="tablist" aria-label="분야 필터">
            <button role="tab" aria-selected={!activeField} onClick={() => selectField(null)}>
              전체
            </button>
            {fields.map((field) => (
              <button
                key={field}
                role="tab"
                aria-selected={activeField === field}
                onClick={() => selectField(field)}
              >
                {CASE_FIELD_LABELS[field]}
              </button>
            ))}
          </div>
        )}

        {/* 가사 사례 미게시 방침 (2026-08) — 하단 고지문 계열의 담백한 한 줄, 박스 없음.
            이혼·상속 칩은 사례가 없어 위 필터에 자동으로 나타나지 않는다. */}
        {showFilter && (
          <p className="-mt-3 mb-8 text-[12.5px] leading-[1.85] text-[#a8a294] break-keep">
            이혼·상속 등 가사 사건의 사례는 올리지 않습니다. 가족의 일은 결과가 좋았더라도,
            당사자에게는 평생 사적인 기록이기 때문입니다.
          </p>
        )}

        <div className="cases-grid">
          {displayCases.map((item) => (
            // 카드 전체가 클릭 영역 (지시서 2)
            <Link key={item.slug} href={`/cases/${item.slug}`} className="case-card">
              <div className="cc-badges">
                {/* 결과가 카드의 첫 정보 — 네이비 솔리드 */}
                {item.result && <span className="cc-result">{item.result}</span>}
                <span className="cc-cat">{item.fieldLabel}</span>
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
