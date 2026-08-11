import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllNewsIssues,
  getNewsIssue,
  validateNewsGuideLinks,
  formatPublishedAt,
  formatPeriodRange,
} from '../../../../lib/content';

export function generateStaticParams() {
  return getAllNewsIssues().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const issue = getNewsIssue(params.slug);
  if (!issue) return {};
  const description = issue.items.map((i) => i.title).join(' · ').slice(0, 150);
  return {
    // 레이아웃 템플릿(%s | 법무법인 명)과 합쳐 "{title} | 주간 법률 소식 | 법무법인 명"
    title: `${issue.title} | 주간 법률 소식`,
    description,
    openGraph: { url: './', title: `${issue.title} | 주간 법률 소식 | 법무법인 명`, description },
    alternates: { canonical: `/news/${issue.slug}` },
  };
}

/**
 * 주간호 본문 (NEWS_BOARD_BRIEF §3, 시안 B).
 * 본문은 .news-item 블록 나열 HTML — 관련 가이드 링크는 발행본만 렌더(빌드 시 검증).
 * 푸터 고지는 템플릿이 고정 렌더한다.
 */
export default function NewsIssuePage({ params }: { params: { slug: string } }) {
  const issue = getNewsIssue(params.slug);
  if (!issue) notFound();

  const body = validateNewsGuideLinks(issue.body);

  return (
    <div className="pt-28 pb-16 md:pt-32">
      <div className="max-w-[820px] mx-auto px-6">
        <div className="text-[12.5px] text-[#8a8578] mb-5">
          <Link href="/legal-info" className="hover:text-brand-dark transition-colors">
            법률정보
          </Link>
          <b className="text-[#c9c3b6] font-normal mx-1.5">›</b>
          <Link href="/news" className="hover:text-brand-dark transition-colors">
            소식
          </Link>
        </div>

        <div className="news-issue">
          <div className="head">
            <div className="no">주간 법률 소식</div>
            <h1>{issue.title}</h1>
            <div className="range">
              {formatPeriodRange(issue.periodStart, issue.periodEnd)} | 발행{' '}
              {formatPublishedAt(issue.publishedAt)}
            </div>
          </div>

          <div className="news-body" dangerouslySetInnerHTML={{ __html: body }} />

          <div className="foot">
            이 소식지는 지난 한 주의 법령·판결 중 실무에 영향이 있는 것을 골라 요약한
            것입니다. 요약은 이해를 위한 것으로, 개별 사안에 대한 법률 자문이 아닙니다. —
            법무법인 명
          </div>
        </div>

        <div className="mt-10">
          <Link href="/news" className="text-sm text-brand-gold hover:underline">
            ← 소식 목록
          </Link>
        </div>
      </div>
    </div>
  );
}
