import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { LegalInfo } from '../../../components/LegalInfo';
import { getAllLegalPosts } from '../../../api/legalPosts';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '최신 법률 정보',
  description: '법무법인 명의 변호사들이 직접 분석한 최신 법률 이슈와 실무 가이드를 제공합니다.',
  alternates: { canonical: '/insights' },
};

export default async function InsightsPage() {
  const posts = await getAllLegalPosts().catch(() => []);

  return (
    <>
      {/* 현행 desk-still 이미지 헤더 유지 (지침: 제거 금지) */}
      <PageHeader
        label="Legal Insights"
        title="최신 법률 정보"
        subtitle="법무법인 명의 변호사들이 직접 분석한 최신 법률 이슈와 실무 가이드를 제공합니다."
        imageSrc="/assets/brand/desk-still.webp"
        imageAlt="변호사 책상 위의 책과 만년필"
      />
      <LegalInfo posts={posts} />
    </>
  );
}
