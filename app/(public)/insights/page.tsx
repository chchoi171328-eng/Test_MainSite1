import type { Metadata } from 'next';
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
    <div className="pt-20">
      <LegalInfo posts={posts} />
    </div>
  );
}
