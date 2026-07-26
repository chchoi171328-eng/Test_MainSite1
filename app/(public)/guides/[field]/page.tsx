import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../../components/PageHeader';
import {
  FIELDS,
  FIELD_LABELS,
  getGuidesByField,
  formatReviewedAt,
  isFieldKey,
} from '../../../../lib/content';

export function generateStaticParams() {
  return FIELDS.map((field) => ({ field }));
}

export async function generateMetadata({
  params,
}: {
  params: { field: string };
}): Promise<Metadata> {
  if (!isFieldKey(params.field)) return {};
  const label = FIELD_LABELS[params.field];
  return {
    title: `${label} 법률정보`,
    description: `법무법인 명이 정리한 ${label} 분야 법률 가이드입니다.`,
    alternates: { canonical: `/guides/${params.field}` },
  };
}

export default function GuideFieldPage({ params }: { params: { field: string } }) {
  if (!isFieldKey(params.field)) notFound();
  const field = params.field;
  const guides = getGuidesByField(field).filter((g) => !g.draft);
  const label = FIELD_LABELS[field];

  return (
    <>
      <PageHeader
        label="Legal Guide"
        title={`${label} 법률정보`}
        subtitle={`${label} 분야에서 자주 묻는 절차와 기준을 정리했습니다.`}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="mb-8 text-sm">
            <Link href="/legal-info" className="text-brand-gold hover:underline">
              ← 법률정보 전체
            </Link>
          </div>

          {guides.length === 0 ? (
            <div className="border border-gray-200 bg-gray-50 rounded-sm p-8 text-center">
              <p className="text-gray-600 break-keep">
                이 분야의 가이드를 준비하고 있습니다.
              </p>
              <p className="mt-2 text-sm text-gray-500 break-keep">
                먼저{' '}
                <Link href={`/practice/${field}`} className="text-brand-gold hover:underline">
                  {label} 업무 분야 안내
                </Link>
                를 확인하실 수 있습니다.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {guides.map((g) => (
                <li key={g.slug} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <Link href={`/guides/${g.field}/${g.slug}`} className="group block">
                    <h2 className="text-lg font-bold text-brand-dark group-hover:text-brand-gold transition-colors break-keep">
                      {g.listingTitle}
                    </h2>
                    {g.summary && (
                      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed break-keep">
                        {g.summary}
                      </p>
                    )}
                    {g.reviewedAt && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        {formatReviewedAt(g.reviewedAt)} 확인
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href={`/practice/${field}`}
              className="inline-flex items-center gap-2 text-sm text-brand-dark hover:text-brand-gold transition-colors"
            >
              {label} 업무 분야 안내 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
