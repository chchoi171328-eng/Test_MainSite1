import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuideBody } from '../../../../components/guide/GuideBody';
import { LegalDisclaimer } from '../../../../components/guide/GuideComponents';
import {
  getAllNews,
  getNewsItem,
  getGuidesForPractice,
  formatPublishedAt,
  NEWS_CATEGORY_LABELS,
  FIELD_LABELS,
} from '../../../../lib/content';

export function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const item = getNewsItem(params.slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      url: './', title: `${item.title} | 법무법인 명`, description: item.summary },
    alternates: { canonical: `/news/${item.slug}` },
  };
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const item = getNewsItem(params.slug);
  if (!item) notFound();

  // 소식은 가이드보다 단순한 레이아웃 — 요약박스·목차·기한박스 없음
  const relatedGuides = item.field ? getGuidesForPractice(item.field, 3) : [];

  return (
    <>
      <div className="pt-28 pb-6 md:pt-32">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="text-[12.5px] text-[#8a8578] mb-4">
            <Link href="/legal-info" className="hover:text-brand-dark">
              법률정보
            </Link>
            <b className="text-[#c9c3b6] font-normal mx-1.5">›</b>
            <Link href="/news" className="hover:text-brand-dark">
              소식
            </Link>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm">
              {NEWS_CATEGORY_LABELS[item.category]}
            </span>
            {/* 소식은 발행일을 명확히 표기한다 (가이드와 반대) */}
            <span className="text-xs text-gray-400">{formatPublishedAt(item.publishedAt)}</span>
          </div>
          <h1 className="font-serif text-[25px] md:text-[31px] font-bold leading-[1.45] break-keep text-[#1c1c1c]">
            {item.title}
          </h1>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-6">
        <article>
          <GuideBody source={item.body} toc={[]} />
        </article>

        <LegalDisclaimer />

        {item.field && (
          <div className="mt-10 border-t-2 border-brand-dark pt-[22px]">
            <div className="text-sm font-bold text-brand-dark mb-3">관련 자료</div>
            <Link
              href={`/practice/${item.field}`}
              className="flex justify-between items-center gap-4 py-[13px] border-b border-[#f2efe9] text-[#333] text-[14.8px] hover:text-brand-dark transition-colors break-keep"
            >
              <span>{FIELD_LABELS[item.field]} — 업무 분야 안내</span>
              <span className="text-[11.5px] text-[#8a8578] shrink-0">업무 분야</span>
            </Link>
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
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

        <div className="mt-10 pb-16">
          <Link href="/news" className="text-sm text-brand-gold hover:underline">
            ← 소식 목록
          </Link>
        </div>
      </div>
    </>
  );
}
