import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '../../../components/PageHeader';
import {
  FIELDS,
  FIELD_LABELS,
  getAllGuides,
  getAllNews,
  formatReviewedAt,
  formatPublishedAt,
  NEWS_CATEGORY_LABELS,
} from '../../../lib/content';

export const metadata: Metadata = {
  title: '법률정보',
  description:
    '법무법인 명이 분야별로 정리한 법률 가이드입니다. 절차와 기준, 기한을 주제별로 확인하실 수 있습니다.',
  alternates: { canonical: '/legal-info' },
};

export default function LegalInfoPage() {
  const guides = getAllGuides().filter((g) => !g.draft);
  const news = getAllNews().filter((n) => !n.draft);
  const recentNews = news.slice(0, 5);

  // 분야별 묶음 — 카드 순서와 동일. 글이 없는 분야는 섹션 자체를 숨긴다
  const sections = FIELDS.map((field) => ({
    field,
    label: FIELD_LABELS[field],
    items: guides.filter((g) => g.field === field),
  })).filter((s) => s.items.length > 0);

  return (
    <>
      <PageHeader
        label="Legal Guide"
        title="법률정보"
        subtitle="분야별로 절차와 기준을 정리했습니다."
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          {sections.length === 0 ? (
            <div className="border border-gray-200 bg-gray-50 rounded-sm p-8 md:p-10">
              <p className="text-brand-dark font-medium mb-3 break-keep">
                분야별 법률 가이드를 준비하고 있습니다.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed break-keep">
                업무 분야별 절차와 기준은 아래 업무 분야 안내에서 먼저 확인하실 수 있습니다.
                가이드는 준비되는 대로 이 페이지에 분야별로 정리됩니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {FIELDS.map((field) => (
                  <Link
                    key={field}
                    href={`/practice/${field}`}
                    className="px-3 py-2 text-sm border border-gray-200 bg-white rounded-sm text-gray-600 hover:border-brand-dark hover:text-brand-dark transition-colors break-keep"
                  >
                    {FIELD_LABELS[field]}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {sections.map((section) => (
                <div key={section.field}>
                  <div className="flex items-baseline justify-between gap-4 mb-4 pb-2 border-b-2 border-brand-dark">
                    <h2 className="font-serif text-xl font-bold text-brand-dark break-keep">
                      {section.label}
                    </h2>
                    <Link
                      href={`/guides/${section.field}`}
                      className="text-xs text-brand-gold hover:underline shrink-0"
                    >
                      분야 전체 보기 →
                    </Link>
                  </div>
                  <ul className="space-y-5">
                    {section.items.map((g) => (
                      <li key={g.slug}>
                        <Link
                          href={`/guides/${g.field}/${g.slug}`}
                          className="group flex items-start gap-4"
                        >
                          {g.thumbnail && (
                            <span className="block w-28 md:w-32 shrink-0 aspect-video overflow-hidden rounded-sm bg-gray-100">
                              <Image
                                src={g.thumbnail}
                                alt=""
                                width={320}
                                height={180}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </span>
                          )}
                          <span className="block min-w-0">
                            <span className="text-[15px] font-medium text-brand-dark group-hover:text-brand-gold transition-colors break-keep">
                              {g.listingTitle}
                            </span>
                            {g.summary && (
                              <span className="block mt-1 text-sm text-gray-500 leading-relaxed break-keep">
                                {g.summary}
                              </span>
                            )}
                            {g.reviewedAt && (
                              <span className="block mt-1 text-xs text-gray-400">
                                {formatReviewedAt(g.reviewedAt)} 확인
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* 최근 소식 — 부속 */}
          {recentNews.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 className="font-serif text-lg font-bold text-brand-dark">최근 소식</h2>
                <Link href="/news" className="text-xs text-brand-gold hover:underline shrink-0">
                  소식 전체 보기 →
                </Link>
              </div>
              <ul className="space-y-3">
                {recentNews.map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/news/${n.slug}`}
                      className="flex items-baseline gap-3 group py-1.5 border-b border-gray-100"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm shrink-0">
                        {NEWS_CATEGORY_LABELS[n.category]}
                      </span>
                      <span className="text-sm text-brand-dark group-hover:text-brand-gold transition-colors break-keep flex-grow">
                        {n.title}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatPublishedAt(n.publishedAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 법률 서식·주요 판례 — 기존 자산 유지 (사용자 확정) */}
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="font-serif text-lg font-bold text-brand-dark mb-4">그 밖의 자료</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Link
                href="/legal-forms"
                className="flex justify-between items-center border border-gray-200 rounded-sm px-5 py-4 hover:border-brand-dark transition-colors"
              >
                <span className="text-[15px] text-brand-dark break-keep">법률 서식</span>
                <span className="text-xs text-gray-400">다운로드</span>
              </Link>
              <Link
                href="/legal-cases"
                className="flex justify-between items-center border border-gray-200 rounded-sm px-5 py-4 hover:border-brand-dark transition-colors"
              >
                <span className="text-[15px] text-brand-dark break-keep">주요 판례</span>
                <span className="text-xs text-gray-400">판례 해설</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
