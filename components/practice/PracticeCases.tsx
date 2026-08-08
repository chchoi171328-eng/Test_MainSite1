import React from 'react';
import Link from 'next/link';
import { CaseItem } from '../../lib/cases';
import { PSection, MoreLink } from './PracticeShared';

/**
 * §7 성공사례 카드 — 파일 기반 사례를 분야 태그로 필터해 최신 3건 표시.
 * 해당 분야 사례가 0건이면 섹션 전체를 렌더링하지 않는다 (지침 1-4, 허위 표시 금지).
 */
export function PracticeCases({
  cases,
  field,
  title,
  lead,
  moreLabel,
}: {
  cases: CaseItem[];
  /** frontmatter category 값 (예: '형사') — 필터·더보기 링크에 사용 */
  field: string;
  title: string;
  lead: string;
  moreLabel: string;
}) {
  const fieldCases = cases.filter((c) => c.category === field).slice(0, 3);
  if (fieldCases.length === 0) return null;

  return (
    <PSection title={title} lead={lead}>
      <div className="grid md:grid-cols-3 gap-3.5">
        {fieldCases.map((c) => (
          <Link
            key={c.slug}
            href={`/cases/${c.slug}`}
            className="border border-[#eae6df] rounded p-[18px] hover:shadow-md transition-shadow"
          >
            <div className="flex gap-2 items-center mb-2.5">
              <span className="text-[11px] tracking-[0.06em] text-[#b0a893]">{c.category}</span>
              {c.result && (
                <span className="text-[11.5px] font-bold text-[#8a6f4d] bg-[#f6efe3] py-[3px] px-[9px] rounded-sm">
                  {c.result}
                </span>
              )}
            </div>
            <div className="text-[14.5px] font-medium text-brand-dark leading-[1.55] break-keep">
              {c.listTitle}
            </div>
          </Link>
        ))}
      </div>
      <MoreLink href={`/cases?category=${encodeURIComponent(field)}`}>{moreLabel}</MoreLink>
    </PSection>
  );
}
