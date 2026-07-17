import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseDetail } from '../../../../components/CaseDetail';
import { getLegalCaseById } from '../../../../api/legalCases';
import { JsonLd } from '../../../../components/JsonLd';
import { SITE_URL } from '../../../../lib/organization';
import { buildBreadcrumbJsonLd } from '../../../../lib/seo';

export const revalidate = 300;

interface Props {
  params: { slug: string };
}

async function fetchCase(slug: string) {
  const id = Number(slug);
  if (!Number.isInteger(id)) return null;
  return getLegalCaseById(id).catch(() => null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseItem = await fetchCase(params.slug);
  if (!caseItem) return { title: '주요 판례' };
  return {
    title: `${caseItem.title} | 주요 판례`,
    description: (caseItem.summary || '').slice(0, 150) || `${caseItem.court} ${caseItem.caseNumber} 판례 해설 — 법무법인 명`,
    alternates: { canonical: `/legal-cases/${params.slug}` },
  };
}

export default async function LegalCaseDetailPage({ params }: Props) {
  const caseItem = await fetchCase(params.slug);
  if (!caseItem) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseItem.title,
    description: (caseItem.summary || '').slice(0, 200),
    url: `${SITE_URL}/legal-cases/${params.slug}`,
    author: { '@id': `${SITE_URL}/attorneys/choi-cheolho#person` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/legal-cases/${params.slug}`,
    inLanguage: 'ko',
  };

  return (
    <div className="pt-20">
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: '홈', path: '/' },
          { name: '주요 판례', path: '/legal-cases' },
          { name: caseItem.title, path: `/legal-cases/${params.slug}` },
        ])}
      />
      <CaseDetail caseItem={caseItem} />
    </div>
  );
}
