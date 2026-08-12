import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, FileDigit } from 'lucide-react';
import type { PrecedentItem } from '../lib/resources';
import type { Guide } from '../lib/content';
import { FIELD_LABELS } from '../lib/fields';

interface CaseDetailProps {
  precedent: PrecedentItem;
  /** 선고 표시줄 (예: "대법원 2023. 7. 17. 선고") */
  courtLine: string;
  /** 발행된 관련 가이드만 (소비처에서 검증 완료) */
  relatedGuides: Guide[];
}

/**
 * 판례 상세 (RESOURCES_STATIC_BRIEF — 현행 디자인 유지, 데이터 소스만 교체).
 * 하단에 관련 가이드 링크 블록 추가 (발행분만 — 기존 규칙).
 */
export const CaseDetail: React.FC<CaseDetailProps> = ({ precedent, courtLine, relatedGuides }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Link
          href="/legal-cases"
          className="inline-flex items-center text-sm text-gray-500 hover:text-brand-dark mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 목록으로
        </Link>

        <header className="mb-12 bg-gray-50 p-8 rounded-sm border-l-4 border-brand-gold">
          <div className="flex flex-wrap gap-2 mb-4">
            {precedent.fieldLabels.map((label, i) => (
              <span key={i} className="text-xs font-bold uppercase tracking-wider bg-white text-brand-gold px-2 py-1 rounded-sm border border-brand-gold/20">
                {label}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-6 leading-snug break-keep">
            {precedent.title}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600 font-mono">
            <div className="flex items-center gap-2">
              <Scale size={16} />
              <span>{courtLine}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileDigit size={16} />
              <span>{precedent.caseNumber}</span>
            </div>
          </div>
        </header>

        <article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-dark prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-brand-dark">
          <div className="prose prose-lg max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: precedent.body }} />
        </article>

        {/* 관련 가이드 — 발행분만 (지시서 작업 3) */}
        {relatedGuides.length > 0 && (
          <div className="mt-14 border-t-2 border-brand-dark pt-[22px]">
            <div className="text-sm font-bold text-brand-dark mb-3">관련 가이드</div>
            {relatedGuides.map((g) => (
              <Link
                key={`${g.field}/${g.slug}`}
                href={`/guides/${g.field}/${g.slug}`}
                className="flex justify-between items-center gap-4 py-[13px] border-b border-[#f2efe9] text-[#333] text-[14.8px] hover:text-brand-dark transition-colors break-keep"
              >
                <span>{g.listingTitle}</span>
                <span className="text-[11.5px] text-[#8a8578] shrink-0">
                  {FIELD_LABELS[g.field]} 가이드
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
          <Link
            href="/legal-cases"
            className="px-8 py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors"
          >
            목록으로
          </Link>
        </div>
      </div>
    </section>
  );
};
