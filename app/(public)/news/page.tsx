import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { PageHeader } from '../../../components/PageHeader';
import {
  getAllNewsIssues,
  formatIssueDay,
  NEWS_CATEGORY_SHORT,
} from '../../../lib/content';

export const metadata: Metadata = {
  title: '소식',
  description: '한 주의 법령 제·개정과 주요 판결을 정리해 올립니다.',
  alternates: { canonical: '/news' },
};

/**
 * 소식 목록 = 주간호 아카이브 (NEWS_BOARD_BRIEF §2, 시안 A).
 * 연도 그룹 라벨 → 주간호 리스트 (좌열 날짜만 — 호수 없음).
 * 발행 주기를 약속하는 문구는 쓰지 않는다.
 */
export default function NewsListPage() {
  const issues = getAllNewsIssues().filter((n) => !n.draft);

  // 연도 그룹 (발행일 역순 유지)
  const byYear: { year: string; list: typeof issues }[] = [];
  for (const issue of issues) {
    const year = issue.publishedAt.slice(0, 4);
    const group = byYear.find((g) => g.year === year);
    if (group) group.list.push(issue);
    else byYear.push({ year, list: [issue] });
  }

  return (
    <>
      <PageHeader label="News" title="소식" subtitle="한 주의 법령 제·개정과 주요 판결을 정리해 올립니다." />

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-[820px]">
          <div className="mb-4 text-sm">
            <Link href="/legal-info" className="text-brand-gold hover:underline">
              ← 법률정보 전체
            </Link>
          </div>

          {issues.length === 0 ? (
            <div className="border border-gray-200 bg-gray-50 rounded-sm p-8 text-center">
              <p className="text-gray-600 break-keep">등록된 소식이 없습니다.</p>
            </div>
          ) : (
            <div className="news-archive">
              {byYear.map(({ year, list }) => (
                <React.Fragment key={year}>
                  <div className="yr">{year}년</div>
                  {list.map((issue) => (
                    <Link key={issue.slug} href={`/news/${issue.slug}`} className="issue">
                      <span className="ino">
                        <b>{formatIssueDay(issue.publishedAt)}</b>
                      </span>
                      <span>
                        <span className="it">{issue.title}</span>
                        {issue.items.length > 0 && (
                          <span className="icontents">
                            {issue.items.map((item, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && ' · '}
                                <span className={`tag ${item.category}`}>
                                  {NEWS_CATEGORY_SHORT[item.category]}
                                </span>
                                {item.title}
                              </React.Fragment>
                            ))}
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
