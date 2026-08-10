import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight, Phone } from 'lucide-react';
import {
  PRACTICE_AREA_DEFINITIONS,
  DEFAULT_DISCLAIMER,
  getPracticeAreaDefinition,
  getReviewedContent,
} from '../../../../data/practice-areas';
import { JsonLd } from '../../../../components/JsonLd';
import { TrackedLink } from '../../../../components/TrackedLink';
import { SITE_URL } from '../../../../lib/organization';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return PRACTICE_AREA_DEFINITIONS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const definition = getPracticeAreaDefinition(params.slug);
  if (!definition) return {};
  const content = getReviewedContent(params.slug);

  return {
    title: { absolute: content?.metaTitle || definition.metaTitle },
    description: content?.metaDescription || definition.metaDescription,
    alternates: { canonical: `/practice/${params.slug}` },
    // 검수(reviewedBy) 완료 콘텐츠가 없는 페이지는 noindex (지침 5·14단계)
    ...(!content && { robots: { index: false, follow: true } }),
  };
}

export default function PracticeAreaDetailPage({ params }: Props) {
  const definition = getPracticeAreaDefinition(params.slug);
  if (!definition) notFound();

  const content = getReviewedContent(params.slug);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '업무 분야', item: `${SITE_URL}/practice` },
      { '@type': 'ListItem', position: 3, name: definition.title, item: `${SITE_URL}/practice/${definition.slug}` },
    ],
  };

  return (
    <div className="pt-20">
      <JsonLd data={breadcrumbJsonLd} />
      {content && content.faq.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: content.faq.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }}
        />
      )}

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="현재 위치" className="flex items-center gap-1 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-brand-gold transition-colors">홈</Link>
            <ChevronRight size={14} />
            <Link href="/practice" className="hover:text-brand-gold transition-colors">업무 분야</Link>
            <ChevronRight size={14} />
            <span className="text-brand-dark font-medium">{definition.title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-10 break-keep">
            {definition.title}
          </h1>

          {content ? (
            <>
              {/* 도입부 */}
              <div className="space-y-4 text-gray-600 leading-relaxed break-keep mb-14 whitespace-pre-line">
                {content.intro}
              </div>

              {/* 대표적인 사건 유형 */}
              <SectionTitle>대표적인 사건 유형</SectionTitle>
              <ul className="grid sm:grid-cols-2 gap-3 mb-14">
                {content.caseTypes.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-gray-600 break-keep">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-2.5 shrink-0"></span>
                    {t}
                  </li>
                ))}
              </ul>

              {/* 자주 발생하는 법률 쟁점 */}
              <SectionTitle>자주 발생하는 법률 쟁점</SectionTitle>
              <div className="space-y-6 mb-14">
                {content.legalIssues.map((li) => (
                  <div key={li.issue} className="border-l-2 border-brand-gold/40 pl-5">
                    <h3 className="font-bold text-brand-dark mb-1 break-keep">{li.issue}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed break-keep">{li.explanation}</p>
                  </div>
                ))}
              </div>

              {/* 초기 대응 방법 */}
              <SectionTitle>초기 대응 방법</SectionTitle>
              <p className="text-gray-600 leading-relaxed break-keep mb-14 whitespace-pre-line">{content.initialResponse}</p>

              {/* 필요한 증거와 서류 */}
              <SectionTitle>필요한 증거와 서류</SectionTitle>
              <ul className="space-y-2 mb-14">
                {content.requiredEvidence.map((e) => (
                  <li key={e} className="flex items-start gap-3 text-gray-600 break-keep">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-2.5 shrink-0"></span>
                    {e}
                  </li>
                ))}
              </ul>

              {/* 일반적인 진행 절차 */}
              <SectionTitle>일반적인 진행 절차</SectionTitle>
              <ol className="space-y-6 mb-14">
                {content.procedure.map((p, i) => (
                  <li key={p.step} className="flex gap-4">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-brand-light text-brand-dark font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-brand-dark mb-1 break-keep">{p.step}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed break-keep">{p.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* 변호사 선임이 필요한 시점 */}
              <SectionTitle>변호사 선임이 필요한 시점</SectionTitle>
              <p className="text-gray-600 leading-relaxed break-keep mb-14 whitespace-pre-line">{content.whenToHireLawyer}</p>

              {/* 최철호 변호사의 관련 경험 */}
              <SectionTitle>최철호 변호사의 관련 경험</SectionTitle>
              <div className="bg-brand-light p-8 rounded-sm mb-14">
                <p className="text-gray-600 leading-relaxed break-keep whitespace-pre-line">{content.attorneyExperience}</p>
                <Link href="/attorneys/choi-cheolho" className="inline-block mt-4 text-brand-gold font-bold hover:text-brand-dark transition-colors">
                  변호사 프로필 보기 &rarr;
                </Link>
              </div>

              {/* 관련 성공사례 / 법률정보 */}
              {(content.relatedCaseSlugs.length > 0 || content.relatedInsightSlugs.length > 0) && (
                <>
                  <SectionTitle>관련 콘텐츠</SectionTitle>
                  <div className="flex flex-wrap gap-3 mb-14">
                    {content.relatedCaseSlugs.map((id) => (
                      <Link key={`case-${id}`} href={`/cases/${id}`} className="px-4 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 hover:border-brand-gold hover:text-brand-gold transition-colors">
                        성공사례 보기
                      </Link>
                    ))}
                    {content.relatedInsightSlugs.map((id) => (
                      <Link key={`insight-${id}`} href={`/insights/${id}`} className="px-4 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 hover:border-brand-gold hover:text-brand-gold transition-colors">
                        법률정보 보기
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* FAQ */}
              {content.faq.length > 0 && (
                <>
                  <SectionTitle>자주 묻는 질문</SectionTitle>
                  <div className="space-y-4 mb-14">
                    {content.faq.map((f) => (
                      <details key={f.question} className="border border-gray-200 rounded-sm p-5 group">
                        <summary className="font-bold text-brand-dark cursor-pointer break-keep">{f.question}</summary>
                        <p className="mt-3 text-gray-600 text-sm leading-relaxed break-keep">{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            /* 콘텐츠 대기 상태 — 법률 본문은 변호사 검수 콘텐츠가 제공될 때까지 게시하지 않는다 */
            <div className="mb-14">
              <p className="text-gray-600 leading-relaxed break-keep mb-6">
                {definition.title} 분야의 상세 안내 페이지를 준비하고 있습니다.
              </p>
              <p className="text-gray-600 leading-relaxed break-keep">
                지금 바로 도움이 필요하시면 전화 또는 온라인 상담으로 문의해 주세요.
                먼저 상황을 듣고, 가능한 방법을 솔직하게 말씀드리겠습니다.
              </p>
            </div>
          )}

          {/* 상담 신청 (공통) */}
          <div className="border-t border-gray-100 pt-10 mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-white font-bold rounded-sm hover:bg-yellow-700 shadow-lg transition-all"
              >
                온라인 상담 신청 <ArrowRight size={18} />
              </Link>
              <TrackedLink
                href="tel:0316586100"
                event="call_click"
                eventParams={{ location: 'practice_detail' }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-brand-dark text-brand-dark font-bold rounded-sm hover:bg-brand-dark hover:text-white transition-all"
              >
                <Phone size={18} /> 031-658-6100
              </TrackedLink>
            </div>
          </div>

          {/* 면책 문구 (공통) */}
          <p className="text-xs text-gray-400 leading-relaxed break-keep">
            {content?.disclaimer || DEFAULT_DISCLAIMER}
          </p>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">{children}</h2>;
}
