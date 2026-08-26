import React from 'react';
import Link from 'next/link';
import { CaseItem, getCaseExcerpt } from '../../lib/cases';
import { type CaseField } from '../../lib/fields';
import { PSection, MoreLink } from './PracticeShared';

/**
 * "이 분야의 성공사례" — practice 페이지 공통 섹션 (절차·유형 설명 뒤, FAQ 앞).
 * field 일치 사례 최대 3건: featured: true 우선, 나머지는 최신순으로 채운다.
 * 해당 분야 사례가 0건이면 섹션 전체를 렌더링하지 않는다 (빈 분야 자동 숨김 원칙).
 * 카드는 성공사례 목록 카드(cases-list-preview.html 계열, .case-card)의 축소판 —
 * 결과 배지(네이비) + list_title + summary 한 줄.
 */
export function PracticeCases({
  cases,
  field,
  tag,
}: {
  cases: CaseItem[];
  /** 업무분야 키 (lib/fields.ts CaseField, 예: 'criminal') — 필터·전체 보기 링크에 사용 */
  field: CaseField;
  /**
   * 특화 페이지용 — 이 태그가 붙은 사례만 노출한다 (field 대신 태그로 매칭).
   * 태그 사례가 0건이면 예외 없이 섹션을 숨긴다 (PLANT_PAGE_BRIEF §3-3).
   * 태그 사례는 여러 분야에 걸치므로 "전체 보기"는 분야 한정 없이 /cases로 보낸다.
   */
  tag?: string;
}) {
  // getAllCases()가 이미 날짜 역순이므로 featured 우선 안정 정렬만 얹는다
  // (특화 페이지의 노출 우선순위는 해당 사례 frontmatter의 featured로 제어한다)
  const matched = tag
    ? cases.filter((c) => (c.tags ?? []).includes(tag))
    : cases.filter((c) => c.field === field);
  const fieldCases = [...matched.filter((c) => c.featured), ...matched.filter((c) => !c.featured)].slice(0, 3);

  // 가사(이혼·상속) 사례 미게시 방침 (2026-08): 이 두 분야만 0건 자동 숨김 대신
  // 방침 블록을 표시한다 (no-cases-preview.html 시안 A — 라이트 스테이트먼트 박스).
  // 나머지 분야의 자동 숨김 로직은 그대로.
  if (fieldCases.length === 0) {
    // 태그 모드(특화 페이지)는 방침 블록 대상이 아니다 — 무조건 숨김
    if (tag) return null;
    if (field === 'divorce' || field === 'inheritance') {
      return (
        <PSection title="이 분야의 성공사례">
          <div className="bg-[#fbfaf8] border border-[#e7e3db] border-l-[3px] border-l-[#1e3a5f] py-[30px] px-[34px]">
            <div className="font-serif text-[19.5px] font-semibold text-[#1c1c1c] leading-[1.6] break-keep mb-2.5">
              이 분야의 성공사례는 올리지 않습니다.
            </div>
            <p className="text-[14.5px] text-[#6b6b6b] font-light leading-[1.85] break-keep">
              가족의 일은 결과가 좋았더라도, 당사자에게는 평생 사적인 기록이기 때문입니다.
              의뢰인 보호가 사례 소개보다 먼저입니다.
            </p>
          </div>
        </PSection>
      );
    }
    return null;
  }

  return (
    <PSection title="이 분야의 성공사례" lead="결과는 판결문으로 보여드립니다.">
      <div className="cases-grid">
        {fieldCases.map((c) => (
          <Link key={c.slug} href={`/cases/${c.slug}`} className="case-card case-card-mini">
            <div className="cc-badges">
              {c.result && <span className="cc-result">{c.result}</span>}
            </div>
            <h3 className="cc-title">{c.listTitle}</h3>
            <p className="cc-sum">{c.summary || getCaseExcerpt(c.body)}</p>
          </Link>
        ))}
      </div>
      {tag ? (
        <MoreLink href="/cases">성공사례 전체 보기 →</MoreLink>
      ) : (
        <MoreLink href={`/cases?field=${encodeURIComponent(field)}`}>이 분야 사례 전체 보기 →</MoreLink>
      )}
    </PSection>
  );
}
