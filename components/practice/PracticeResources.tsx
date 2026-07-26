import React from 'react';
import { PSection, ResourceList } from './PracticeShared';
import { getGuidesForPractice, FieldKey } from '../../lib/content';
import { getToolsForField } from '../../data/smart-tools';

/**
 * 세부 페이지 §9 「직접 확인해보실 수 있는 것들」 — 빌드 시 자동 생성 (지침 작업 5)
 * - 소스: field가 일치하는 가이드 listingTitle(최대 4건, featured 우선) + 해당 분야 스마트 도구
 * - 가이드 0건이면 도구만 노출한다 (깨진 링크 금지). 더미(_sample-guide)는 제외된다.
 */
export function PracticeResources({ field }: { field: FieldKey }) {
  const guides = getGuidesForPractice(field, 4);
  const tools = getToolsForField(field, guides.length > 0 ? 4 - Math.min(guides.length, 2) : 4);

  const items = [
    ...guides.slice(0, 2).map((g) => ({
      label: g.listingTitle,
      tag: '법률정보',
      href: `/guides/${g.field}/${g.slug}`,
    })),
    ...tools.map((t) => ({ label: t.label, tag: '스마트 도구', href: t.href })),
  ];

  if (items.length === 0) return null;

  return (
    <PSection title="직접 확인해보실 수 있는 것들" lead="상담 전에 활용해 보세요.">
      <ResourceList items={items} />
    </PSection>
  );
}
