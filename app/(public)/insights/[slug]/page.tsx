import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalDetail } from '../../../../components/LegalDetail';
import { getLegalPostById } from '../../../../api/legalPosts';
import { JsonLd } from '../../../../components/JsonLd';
import { SITE_URL } from '../../../../lib/organization';
import { toIsoDate, buildBreadcrumbJsonLd } from '../../../../lib/seo';

export const revalidate = 300;

interface Props {
  params: { slug: string };
}

async function fetchPost(slug: string) {
  const id = Number(slug);
  if (!Number.isInteger(id)) return null;
  return getLegalPostById(id).catch(() => null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  if (!post) return { title: '최신 법률 정보' };
  return {
    title: post.title,
    description: (post.summary || '').slice(0, 150) || `${post.category} 관련 법률 정보 — 법무법인 명`,
    alternates: { canonical: `/insights/${params.slug}` },
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const post = await fetchPost(params.slug);
  if (!post) notFound();

  const datePublished = toIsoDate(post.date);
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: (post.summary || '').slice(0, 200),
    url: `${SITE_URL}/insights/${params.slug}`,
    ...(datePublished && { datePublished }),
    ...(post.imageUrls && post.imageUrls.length > 0 && { image: post.imageUrls[0] }),
    author: { '@id': `${SITE_URL}/attorneys/choi-cheolho#person` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/insights/${params.slug}`,
    inLanguage: 'ko',
  };

  return (
    <div className="pt-20">
      <JsonLd data={blogPostingJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: '홈', path: '/' },
          { name: '최신 법률 정보', path: '/insights' },
          { name: post.title, path: `/insights/${params.slug}` },
        ])}
      />
      <LegalDetail post={post} />
    </div>
  );
}
