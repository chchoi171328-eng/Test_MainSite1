import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseDetail } from '../../../../components/CaseDetail';
import { getAllPrecedents, getPrecedent } from '../../../../lib/resources';
import { getAllGuides } from '../../../../lib/content';
import { formatCourtLine } from '../../../../lib/precedent-format';
import { JsonLd } from '../../../../components/JsonLd';
import { buildBreadcrumbJsonLd } from '../../../../lib/seo';

/**
 * 판례 상세 (파일 기반 — RESOURCES_STATIC_BRIEF).
 * 구 숫자 ID URL(/legal-cases/12)은 middleware가 301로 새 slug에 넘긴다
 * (data/redirects.json precedentLegacy, docs/redirects-legacy.md 기록).
 */

export function generateStaticParams() {
  return getAllPrecedents().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const item = getPrecedent(params.slug);
  if (!item) return { title: '주요 판례' };
  return {
    title: `${item.title} | 주요 판례`,
    description: item.summary.slice(0, 150),
    alternates: { canonical: `/legal-cases/${item.slug}` },
  };
}

export default function LegalCaseDetailPage({ params }: { params: { slug: string } }) {
  const item = getPrecedent(params.slug);
  if (!item) notFound();

  // 관련 가이드 — 발행된 것만 렌더 (깨진 링크 금지)
  const published = getAllGuides().filter((g) => !g.draft);
  const relatedGuides = item.related
    .map((slug) => published.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: '법률정보', path: '/legal-info' },
    { name: '주요 판례', path: '/legal-cases' },
    { name: item.title, path: `/legal-cases/${item.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <CaseDetail
        precedent={item}
        courtLine={formatCourtLine(item.court, item.decidedAt)}
        relatedGuides={relatedGuides}
      />
    </>
  );
}
