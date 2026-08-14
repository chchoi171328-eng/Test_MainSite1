import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../../../components/JsonLd';
import { GuideBody } from '../../../../../components/guide/GuideBody';
import {
  LegalDisclaimer,
  GuideRelated,
  BrandCta,
  GuideMeta,
} from '../../../../../components/guide/GuideComponents';
import {
  getAllGuides,
  getGuide,
  getGuidesByField,
  extractToc,
  withHeadingIds,
  formatReviewedAt,
  FIELD_LABELS,
  isFieldKey,
} from '../../../../../lib/content';
import { SMART_TOOLS } from '../../../../../data/smart-tools';
import { SITE_URL } from '../../../../../lib/site';

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ field: g.field, slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { field: string; slug: string };
}): Promise<Metadata> {
  const guide = getGuide(params.field, params.slug);
  if (!guide) return {};

  return {
    title: { absolute: `${guide.title} | 법무법인 명` },
    description: guide.metaDescription,
    keywords: guide.keywords,
    openGraph: {
      url: './',
      title: `${guide.title} | 법무법인 명`,
      description: guide.metaDescription,
      images: guide.thumbnail ? [guide.thumbnail] : undefined,
    },
    alternates: { canonical: `/guides/${guide.field}/${guide.slug}` },
    // 검수 게이트: approved 전에는 sitemap 제외만으로는 내부 링크를 타고
    // 색인될 수 있으므로 noindex로 막는다 (검수 완료 → approved: true → 색인 허용)
    ...(guide.approved ? {} : { robots: { index: false, follow: true } }),
  };
}

export default function GuidePage({ params }: { params: { field: string; slug: string } }) {
  if (!isFieldKey(params.field)) notFound();
  const guide = getGuide(params.field, params.slug);
  if (!guide) notFound();

  const toc = extractToc(guide.body);
  const body = withHeadingIds(guide.body);
  const reviewedLabel = formatReviewedAt(guide.reviewedAt);

  // 함께 보면 좋은 자료 — ① 세부 페이지(항상 첫 항목) ② 같은 분야 가이드 ③ 스마트 도구
  const relatedGuides = getGuidesByField(guide.field).filter(
    (g) => guide.related.includes(g.slug) && g.slug !== guide.slug
  );
  const relatedItems = [
    {
      label: `${FIELD_LABELS[guide.field]} — 업무 분야 안내`,
      tag: '업무 분야',
      href: `/practice/${guide.field}`,
    },
    ...relatedGuides.map((g) => ({
      label: g.listingTitle,
      tag: `${FIELD_LABELS[guide.field]} 가이드`,
      href: `/guides/${g.field}/${g.slug}`,
    })),
    ...guide.tools
      .map((id) => SMART_TOOLS.find((t) => t.id === id))
      .filter((t): t is (typeof SMART_TOOLS)[number] => Boolean(t))
      .map((t) => ({ label: t.label, tag: '스마트 도구', href: t.href })),
  ];

  return (
    <>
      {/* Article JSON-LD — dateModified만 사용, datePublished는 넣지 않는다 (지침 작업 8-3) */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.title,
          description: guide.metaDescription,
          author: { '@type': 'Person', name: `${guide.author} 변호사` },
          publisher: {
            '@type': 'Organization',
            name: '법무법인 명',
            url: SITE_URL,
          },
          dateModified: guide.reviewedAt,
          ...(guide.thumbnail ? { image: `${SITE_URL}${guide.thumbnail}` } : {}),
          mainEntityOfPage: `${SITE_URL}/guides/${guide.field}/${guide.slug}`,
        }}
      />

      {/* 헤더 — breadcrumb / H1 / 메타(분야 · 작성자 · 검토일) */}
      <div className="pt-28 pb-6 md:pt-32">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="text-[12.5px] text-[#8a8578] mb-4">
            <Link href="/legal-info" className="text-[#8a8578] hover:text-brand-dark">
              법률정보
            </Link>
            <b className="text-[#c9c3b6] font-normal mx-1.5">›</b>
            <Link href={`/guides/${guide.field}`} className="text-[#8a8578] hover:text-brand-dark">
              {FIELD_LABELS[guide.field]}
            </Link>
            <b className="text-[#c9c3b6] font-normal mx-1.5">›</b>
            {guide.listingTitle}
          </div>
          <h1 className="font-serif text-[25px] md:text-[33px] font-bold leading-[1.45] break-keep text-[#1c1c1c]">
            {guide.title}
          </h1>
          <div className="mt-4 text-[12.5px] text-[#8a8578] flex gap-3 flex-wrap items-center">
            <span>{FIELD_LABELS[guide.field]}</span>
            <span className="w-[3px] h-[3px] bg-[#d5cfc2] rounded-full" aria-hidden="true" />
            <span>{guide.author} 변호사</span>
            {reviewedLabel && (
              <>
                <span className="w-[3px] h-[3px] bg-[#d5cfc2] rounded-full" aria-hidden="true" />
                <span>{reviewedLabel} 기준 확인</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-6">
        {guide.thumbnail && (
          <div className="mt-6 mb-1.5">
            <Image
              src={guide.thumbnail}
              alt={guide.listingTitle}
              width={1200}
              height={675}
              priority
              className="w-full h-auto rounded-sm"
            />
          </div>
        )}

        {/* 본문 — 요약 박스·도입·목차(<GuideToc />)는 MDX 안에서 표준 순서대로 배치된다 */}
        <article>
          <GuideBody source={body} toc={toc} />
        </article>

        <LegalDisclaimer />
        <GuideRelated items={relatedItems} />
        <BrandCta
          topic={`${FIELD_LABELS[guide.field]} 문제로 고민 중이시라면`}
          what="지금 상황이 어느 단계인지와 절차의 실익"
        />
        <GuideMeta author={guide.author} reviewedAtLabel={reviewedLabel} />
      </div>
    </>
  );
}
