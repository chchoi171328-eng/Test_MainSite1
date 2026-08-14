import React from 'react';
import Link from 'next/link';

/**
 * 홈 "법률 가이드" 섹션 + 주간 소식 한 줄 바 (구 주요 판례 섹션 자리).
 * - 발행 가이드 featured 우선 최대 4건 — legal-info 목록 카드 계열 (분야 태그 +
 *   listingTitle + summary 한 줄)
 * - 가이드 0건이면 섹션, 주간호 0건이면 바를 각각 미노출 (빈 상태 자동 숨김 원칙)
 */

export interface HomeGuideCard {
  slug: string;
  field: string;
  fieldLabel: string;
  listingTitle: string;
  summary: string;
}

export interface HomeNewsBar {
  slug: string;
  title: string;
  /** "2026. 8. 10." 형식 */
  publishedAtLabel: string;
}

interface HomeGuidesProps {
  guides: HomeGuideCard[];
  latestIssue: HomeNewsBar | null;
}

export const HomeGuides: React.FC<HomeGuidesProps> = ({ guides, latestIssue }) => {
  if (guides.length === 0 && !latestIssue) return null;

  return (
    <section id="legal-guides" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {guides.length > 0 && (
          <>
            <div className="flex items-baseline justify-between gap-4 mb-8 pb-3 border-b-2 border-brand-dark">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark break-keep">
                절차와 기한을 미리 확인하세요
              </h2>
              <Link href="/legal-info" className="text-xs md:text-sm text-brand-gold hover:underline shrink-0">
                법률정보 전체 보기 →
              </Link>
            </div>

            {/* grid-cols-1 명시 필수: 템플릿 없는 auto 트랙은 truncate(nowrap) summary의
                한 줄 전체 폭을 min-content로 삼아 모바일에서 페이지가 가로로 늘어난다 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map((g) => (
                <Link
                  key={`${g.field}/${g.slug}`}
                  href={`/guides/${g.field}/${g.slug}`}
                  className="group min-w-0 bg-white border border-gray-200 rounded-sm p-6 hover:border-brand-gold/60 hover:shadow-md transition-all duration-300"
                >
                  <span className="inline-block text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm mb-2.5">
                    {g.fieldLabel}
                  </span>
                  <h3 className="text-[15.5px] font-medium text-brand-dark group-hover:text-brand-gold transition-colors break-keep leading-relaxed">
                    {g.listingTitle}
                  </h3>
                  {g.summary && (
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed break-keep truncate">
                      {g.summary}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* 주간 소식 한 줄 바 — 최신 주간호 0건이면 미노출 */}
        {latestIssue && (
          <div
            className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${
              guides.length > 0 ? 'mt-8 pt-5 border-t border-gray-200' : ''
            }`}
          >
            <span className="text-[11px] font-bold tracking-[0.14em] text-brand-gold shrink-0">
              주간 법률 소식
            </span>
            <Link
              href={`/news/${latestIssue.slug}`}
              className="text-sm text-brand-dark hover:text-brand-gold transition-colors break-keep min-w-0"
            >
              {latestIssue.title}
            </Link>
            <span className="text-xs text-gray-400 shrink-0">{latestIssue.publishedAtLabel}</span>
            <Link href="/news" className="text-xs text-brand-gold hover:underline shrink-0 ml-auto">
              지난 소식 →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
