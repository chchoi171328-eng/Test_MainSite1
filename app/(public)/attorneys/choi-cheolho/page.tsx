import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, Scale, ExternalLink } from 'lucide-react';
import { JsonLd } from '../../../../components/JsonLd';
import { TrackedLink } from '../../../../components/TrackedLink';
import { buildAttorneyJsonLd, SITE_URL } from '../../../../lib/organization';
import { getAllCases } from '../../../../lib/cases';
import { getAllGuides, FIELD_LABELS } from '../../../../lib/content';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '최철호 대표변호사',
  description:
    '법무법인 명 최철호 대표변호사. GS건설·롯데건설 사내변호사 출신으로 평택에서 형사, 민사, 가사(이혼·상속), 부동산·건설 사건을 수행합니다.',
  alternates: { canonical: '/attorneys/choi-cheolho' },
};

const EDUCATION = ['중앙대학교 컴퓨터공학과', '성균관대학교 법학전문대학원'];

const CAREER = [
  '(현) 법무법인 명 대표변호사',
  '(전) 법무법인 수호 변호사',
  '(전) GS건설 사내변호사',
  '(전) 롯데건설 사내변호사',
  '(전) 서울고등법원 실무수습',
  '(전) 서울북부지방법원 실무수습',
];

const PRACTICE_FOCUS = [
  { title: '형사 변호', href: '/practice' },
  { title: '민사 소송', href: '/practice' },
  { title: '가사(이혼·상속)', href: '/practice' },
  { title: '부동산·건설', href: '/practice' },
  { title: '기업 법무', href: '/practice' },
];

const PRINCIPLES = [
  '승산 없는 소송은 권하지 않습니다. 선임 전에 실익부터 판단합니다.',
  '한 사건을 끝까지 책임지기 위해, 동시에 진행하는 사건 수를 의도적으로 제한합니다.',
  '상담부터 변론까지 같은 변호사가 담당합니다.',
  '듣기 좋은 말보다 뼈아픈 조언이 필요할 때 주저하지 않습니다.',
];

export default async function AttorneyProfilePage() {
  const relatedCases = getAllCases().slice(0, 3);
  const relatedGuides = getAllGuides()
    .filter((g) => !g.draft)
    .slice(0, 3);

  const profilePageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/attorneys/choi-cheolho#profilepage`,
    mainEntity: { '@id': `${SITE_URL}/attorneys/choi-cheolho#person` },
    about: { '@id': `${SITE_URL}/attorneys/choi-cheolho#person` },
  };

  return (
    <div className="pt-20">
      <JsonLd data={buildAttorneyJsonLd()} />
      <JsonLd data={profilePageJsonLd} />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          {/* Profile Header */}
          <div className="grid md:grid-cols-12 gap-12 items-start mb-20">
            <div className="md:col-span-4">
              <div className="relative">
                <Image
                  src="/images/attorney-profile.jpg"
                  alt="법무법인 명 최철호 대표변호사 프로필 사진"
                  width={1200}
                  height={1800}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-auto object-cover shadow-lg"
                />
                <div className="absolute bottom-0 left-0 bg-brand-dark text-white p-4 w-full">
                  <p className="font-serif font-bold text-xl">최철호</p>
                  <p className="text-xs text-brand-gold uppercase tracking-wider">Chulho Choi · Representative Attorney</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-2 break-keep">최철호 대표변호사</h1>
              <p className="text-gray-500 mb-8">법무법인 명(SOL &amp; LUNA) · 평택</p>

              <div className="space-y-4 text-gray-600 leading-relaxed break-keep mb-10">
                <p>
                  GS건설·롯데건설 사내변호사로 일했습니다. 기업이 법을 어떻게 활용하는지 안에서 보고 왔습니다.
                </p>
                <p>
                  컴퓨터공학과 법학을 함께 공부했습니다. 복잡한 사건 구조를 분해해서 보는 훈련이 되어 있습니다.
                </p>
                {/* TODO: 대한변호사협회 형사·민사 전문등록 표기 — 인증 번호/명칭 확인 후 삽입 */}
                {/* TODO: 평택경찰서 범죄피해자 상담 변호사 활동 표기 — 정확한 명칭 확인 후 삽입 */}
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h2 className="font-bold text-brand-dark mb-3 border-b border-gray-200 pb-2">학력</h2>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {EDUCATION.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-bold text-brand-dark mb-3 border-b border-gray-200 pb-2">경력</h2>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {CAREER.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Focus */}
          <div className="mb-20">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">주요 취급 분야</h2>
            <div className="flex flex-wrap gap-3">
              {PRACTICE_FOCUS.map((area) => (
                <Link
                  key={area.title}
                  href={area.href}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-sm text-brand-dark hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <Scale size={16} className="text-brand-gold" />
                  {area.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Principles */}
          <div className="mb-20 bg-brand-light p-8 md:p-12 rounded-sm">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">사건 수행 원칙</h2>
            <ul className="space-y-4">
              {PRINCIPLES.map((principle) => (
                <li key={principle} className="flex items-start gap-3 text-gray-600 leading-relaxed break-keep">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-2.5 shrink-0"></span>
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Success Cases */}
          {relatedCases.length > 0 && (
            <div className="mb-20">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">관련 성공사례</h2>
                <Link href="/cases" className="text-sm text-gray-500 hover:text-brand-gold transition-colors">
                  전체 보기 &rarr;
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedCases.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/cases/${item.slug}`}
                    className="block border border-gray-100 p-6 rounded-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-brand-gold uppercase tracking-wider border border-brand-gold/30 px-2 py-1">{item.fieldLabel}</span>
                      <span className="text-xs font-bold text-brand-dark">{item.result}</span>
                    </div>
                    <p className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors line-clamp-2 break-keep">{item.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 관련 법률정보 — 가이드에서 자동 생성 (가이드 0건이면 섹션 숨김) */}
          {relatedGuides.length > 0 && (
            <div className="mb-20">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">관련 법률정보</h2>
                <Link href="/legal-info" className="text-sm text-gray-500 hover:text-brand-gold transition-colors">
                  전체 보기 &rarr;
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.field}/${guide.slug}`}
                    className="block border border-gray-100 p-6 rounded-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="text-xs text-gray-400 mb-2">{FIELD_LABELS[guide.field]}</div>
                    <p className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors line-clamp-2 break-keep">
                      {guide.listingTitle}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Consultation & English Site */}
          <div className="border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">상담 안내</h2>
            {/* 표준 상담료 블록 — 정본 (FIELD_MASTER_PLAN 상담료 개편) */}
            <div className="mb-6 border border-gray-200 bg-gray-50 p-5 rounded-sm text-gray-600 space-y-1 break-keep">
              <p className="font-bold text-brand-dark">대표변호사 법률상담</p>
              <p className="text-brand-dark font-medium">최대 60분 · 150,000원 (VAT 포함)</p>
              <p>상담이 30분 이내에 끝나면 100,000원만 받습니다.</p>
              <p>사실관계와 자료를 확인하고, 법적 쟁점과 대응 방향을 말씀드립니다.</p>
              <p className="text-sm text-gray-500 pt-1">예약제로 운영되며, 한국어·영어 상담 동일 요금입니다.</p>
            </div>
            <p className="text-gray-600 mb-8 break-keep">
              상담 후 의뢰하지 않으셔도 됩니다.<br />
              먼저 상황을 정확히 아는 것이 시작입니다.
            </p>
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
                eventParams={{ location: 'attorney_profile' }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-brand-dark text-brand-dark font-bold rounded-sm hover:bg-brand-dark hover:text-white transition-all"
              >
                <Phone size={18} /> 031-658-6100
              </TrackedLink>
              <TrackedLink
                href="https://www.lsfp.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                event="english_site_click"
                eventParams={{ location: 'attorney_profile' }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-600 font-bold rounded-sm hover:border-brand-gold hover:text-brand-gold transition-all"
              >
                English Profile <ExternalLink size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
