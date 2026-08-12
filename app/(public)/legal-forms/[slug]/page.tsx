import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { getAllForms, getForm, hasFormBody } from '../../../../lib/resources';
import { getAllGuides } from '../../../../lib/content';
import { FIELD_LABELS } from '../../../../lib/fields';

export function generateStaticParams() {
  return getAllForms().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const form = getForm(params.slug);
  if (!form) return {};
  return {
    title: `${form.title} 서식`,
    description: form.summary || `${form.title} 서식을 내려받아 상황에 맞게 수정해 사용하세요.`,
    alternates: { canonical: `/legal-forms/${form.slug}` },
  };
}

/**
 * 서식 상세 (RESOURCES_STATIC_BRIEF 작업 3 신설) — 간단한 1단 구성 (가이드 스타일 계열).
 * 제목 + summary + 쓰는 법 요점(안내글) + 다운로드 + 관련 가이드(발행분만) + 고정 고지.
 */
export default function LegalFormDetailPage({ params }: { params: { slug: string } }) {
  const form = getForm(params.slug);
  if (!form) notFound();

  // 관련 가이드 — 발행된 것만 렌더 (깨진 링크 금지)
  const published = getAllGuides().filter((g) => !g.draft);
  const relatedGuides = form.related
    .map((slug) => published.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <div className="pt-28 pb-16 md:pt-32">
      <div className="max-w-[720px] mx-auto px-6">
        <div className="text-[12.5px] text-[#8a8578] mb-5">
          <Link href="/legal-info" className="hover:text-brand-dark transition-colors">
            법률정보
          </Link>
          <b className="text-[#c9c3b6] font-normal mx-1.5">›</b>
          <Link href="/legal-forms" className="hover:text-brand-dark transition-colors">
            법률 서식
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-sm">
            {form.fieldLabel}
          </span>
          {form.updatedAt && (
            <span className="text-xs text-gray-400">{form.updatedAt.replace('-', '. ')} 기준</span>
          )}
        </div>
        <h1 className="font-serif text-[26px] md:text-[30px] font-bold leading-[1.45] break-keep text-[#1c1c1c] mb-3">
          {form.title}
        </h1>
        {form.summary && (
          <p className="text-[15px] text-gray-600 leading-relaxed break-keep mb-8">{form.summary}</p>
        )}

        {/* 다운로드 — 실파일 직접 URL */}
        {form.files.length > 0 && (
          <div className="border border-[#e7e3db] rounded-sm p-5 mb-9">
            {form.files.map((file) => (
              <a
                key={file.url}
                href={file.url}
                download
                className="flex items-center justify-between gap-4 py-2 group"
              >
                <span className="flex items-center gap-2.5 font-bold text-brand-dark group-hover:text-brand-gold transition-colors">
                  <Download size={18} className="text-brand-gold" />
                  {form.title} 서식 내려받기
                </span>
                <span className="text-xs text-gray-500 shrink-0">
                  {file.format}
                  {file.size ? ` · ${file.size}` : ''}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* 쓰는 법 요점 + 주의 — 스킬이 작성한 안내글 (이관분은 작성 전이라 생략됨) */}
        {hasFormBody(form) && (
          <div className="form-body" dangerouslySetInnerHTML={{ __html: form.body }} />
        )}

        {/* 관련 가이드 — 발행분만 */}
        {relatedGuides.length > 0 && (
          <div className="mt-10 border-t-2 border-brand-dark pt-[22px]">
            <div className="text-sm font-bold text-brand-dark mb-3">관련 가이드</div>
            {relatedGuides.map((g) => (
              <Link
                key={`${g.field}/${g.slug}`}
                href={`/guides/${g.field}/${g.slug}`}
                className="flex justify-between items-center gap-4 py-[13px] border-b border-[#f2efe9] text-[#333] text-[14.8px] hover:text-brand-dark transition-colors break-keep"
              >
                <span>{g.listingTitle}</span>
                <span className="text-[11.5px] text-[#8a8578] shrink-0">
                  {FIELD_LABELS[g.field]} 가이드
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* 고정 고지 */}
        <div className="mt-10 pt-5 border-t border-[#e7e3db] text-[12.5px] text-[#a8a294] leading-[1.85] break-keep">
          이 서식은 일반적인 상황을 전제로 한 참고용입니다. 구체적 사안에 따라 내용이 달라질 수
          있습니다.
        </div>

        <div className="mt-8">
          <Link href="/legal-forms" className="text-sm text-brand-gold hover:underline">
            ← 서식 목록
          </Link>
        </div>
      </div>
    </div>
  );
}
