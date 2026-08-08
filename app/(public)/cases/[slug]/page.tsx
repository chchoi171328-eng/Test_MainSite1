import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SuccessDetail } from '../../../../components/SuccessDetail';
import { getAllCases, getCase } from '../../../../lib/cases';
import { JsonLd } from '../../../../components/JsonLd';
import { SITE_URL } from '../../../../lib/organization';
import { buildBreadcrumbJsonLd } from '../../../../lib/seo';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseItem = getCase(params.slug);
  if (!caseItem) return { title: '성공사례' };
  return {
    title: `${caseItem.title} | 성공사례`,
    description: `${caseItem.category} 사건 ${caseItem.result} — 법무법인 명의 성공사례입니다.`,
    alternates: { canonical: `/cases/${params.slug}` },
  };
}

export default function CaseDetailPage({ params }: Props) {
  const caseItem = getCase(params.slug);
  if (!caseItem) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseItem.title,
    description: `${caseItem.category} 사건 ${caseItem.result} — 법무법인 명의 성공사례`,
    url: `${SITE_URL}/cases/${params.slug}`,
    ...(caseItem.date ? { datePublished: caseItem.date } : {}),
    author: { '@id': `${SITE_URL}/attorneys/choi-cheolho#person` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/cases/${params.slug}`,
    inLanguage: 'ko',
  };

  return (
    <div className="pt-20">
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: '홈', path: '/' },
          { name: '성공사례', path: '/cases' },
          { name: caseItem.title, path: `/cases/${params.slug}` },
        ])}
      />
      <SuccessDetail caseItem={caseItem} />
    </div>
  );
}
