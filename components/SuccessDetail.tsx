import React from 'react';
import Link from 'next/link';
import { CaseItem } from '../lib/cases';
import { JudgmentDocCard } from './JudgmentDocCard';

/**
 * 성공사례 상세 (CASE_BOARD_BRIEF 작업 4)
 * 시각 정본: docs/SucessCases_pages/case-detail-preview.html
 * 본문 스타일(.case-*)은 app/globals.css에 클래스 스코프로 정의 —
 * 기존 <p> 나열 이관 본문과 신규 구조 본문이 같은 컨테이너에서 공존한다.
 */
export const SuccessDetail: React.FC<{ caseItem: CaseItem }> = ({ caseItem }) => {
  return (
    <article className="max-w-[720px] mx-auto px-6 pt-[52px] pb-20">
      <div className="text-[12.5px] text-[#8a8578] mb-[18px]">
        <Link href="/cases" className="hover:text-brand-dark transition-colors">
          성공사례
        </Link>
        <span className="mx-1.5">›</span>
        <Link
          href={`/cases?category=${encodeURIComponent(caseItem.category)}`}
          className="hover:text-brand-dark transition-colors"
        >
          {caseItem.category}
        </Link>
      </div>

      <div className="flex gap-2 mb-3.5">
        {caseItem.result && (
          <span className="text-[12.5px] px-3 py-[5px] rounded-sm font-medium bg-[#1e3a5f] text-white">
            {caseItem.result}
          </span>
        )}
        <span className="text-[12.5px] px-3 py-[5px] rounded-sm font-medium bg-[#f1eee7] text-[#6b6353]">
          {caseItem.category}
        </span>
      </div>

      <h1 className="font-serif text-[26px] font-bold leading-[1.5] break-keep mb-[26px] text-brand-dark">
        {caseItem.title}
      </h1>

      <div className="case-body" dangerouslySetInnerHTML={{ __html: caseItem.body }} />

      {caseItem.judgmentUrl && caseItem.judgmentFormat && (
        <JudgmentDocCard url={caseItem.judgmentUrl} format={caseItem.judgmentFormat} />
      )}

      <div className="case-notice">
        본 사례는 개별 사건의 결과로, 유사한 사건에서 동일한 결과를 보장하지 않습니다. 의뢰인
        보호를 위해 일부 정보는 변경하거나 생략했습니다.
      </div>

      <div className="mt-10 pt-6 border-t border-[#e7e3db]">
        <Link
          href="/cases"
          className="text-[13.5px] text-[#8a8578] hover:text-brand-dark transition-colors"
        >
          ← 성공사례 목록으로
        </Link>
      </div>
    </article>
  );
};
