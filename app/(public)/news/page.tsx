import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '../../../components/PageHeader';
import { getAllNews, formatPublishedAt, NEWS_CATEGORY_LABELS } from '../../../lib/content';

export const metadata: Metadata = {
  title: '소식',
  description: '법무법인 명의 법령 개정·판례·사무소 소식입니다.',
  alternates: { canonical: '/news' },
};

export default function NewsListPage() {
  const news = getAllNews().filter((n) => !n.draft);

  return (
    <>
      <PageHeader label="News" title="소식" subtitle="법령 개정과 판례, 사무소 소식을 전합니다." />

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="mb-8 text-sm">
            <Link href="/legal-info" className="text-brand-gold hover:underline">
              ← 법률정보 전체
            </Link>
          </div>

          {news.length === 0 ? (
            <div className="border border-gray-200 bg-gray-50 rounded-sm p-8 text-center">
              <p className="text-gray-600 break-keep">등록된 소식이 없습니다.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {news.map((n) => (
                <li key={n.slug} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <Link href={`/news/${n.slug}`} className="group block">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm">
                        {NEWS_CATEGORY_LABELS[n.category]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatPublishedAt(n.publishedAt)}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-brand-dark group-hover:text-brand-gold transition-colors break-keep">
                      {n.title}
                    </h2>
                    {n.summary && (
                      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed break-keep">
                        {n.summary}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
