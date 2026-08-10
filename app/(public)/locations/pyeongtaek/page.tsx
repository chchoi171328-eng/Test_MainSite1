import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, ChevronRight, ArrowRight, MessageSquare } from 'lucide-react';
import { JsonLd } from '../../../../components/JsonLd';
import { TrackedLink } from '../../../../components/TrackedLink';
import { ORG, SITE_URL } from '../../../../lib/organization';
import { PRACTICE_AREA_DEFINITIONS } from '../../../../data/practice-areas';

export const metadata: Metadata = {
  title: { absolute: '평택 변호사 사무실 | 법무법인 명 오시는 길·상담 안내' },
  description:
    '법무법인 명 평택 사무실 안내. 경기도 평택시 평남로 1029-1, SJ프라자 5층. 평일 09:00-18:00, 주말·공휴일 예약제. 전화 031-658-6100.',
  alternates: { canonical: '/locations/pyeongtaek' },
};

const SERVICE_AREAS = [
  { slug: 'anseong', name: '안성' },
  { slug: 'osan', name: '오산' },
  { slug: 'asan', name: '아산' },
];

export default function PyeongtaekPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '평택 사무실', item: `${SITE_URL}/locations/pyeongtaek` },
    ],
  };

  return (
    <div className="pt-20">
      <JsonLd data={breadcrumbJsonLd} />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          {/* Breadcrumb */}
          <nav aria-label="현재 위치" className="flex items-center gap-1 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-brand-gold transition-colors">홈</Link>
            <ChevronRight size={14} />
            <span className="text-brand-dark font-medium">평택 사무실</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-4 break-keep">
            법무법인 명 평택 사무실
          </h1>
          <p className="text-gray-600 leading-relaxed break-keep mb-12 max-w-2xl">
            법무법인 명은 경기도 평택시에 있습니다. 평택을 중심으로 안성·오산·아산 지역의
            사건을 평택 사무실에서 상담합니다.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-brand-dark mb-1">주소</h2>
                  <p className="text-gray-600">{ORG.address.full}</p>
                  {/* TODO: 주차 안내 — 실제 주차 가능 여부·방법 확인 후 구체 내용 기재 */}
                  <p className="text-sm text-gray-500 mt-2">주차는 방문 전 전화 주시면 안내해 드립니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-brand-dark mb-1">전화</h2>
                  <TrackedLink href="tel:0316586100" event="call_click" eventParams={{ location: 'pyeongtaek_page' }} className="text-gray-600 hover:text-brand-gold transition-colors">
                    {ORG.telephone}
                  </TrackedLink>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-brand-dark mb-1">운영시간</h2>
                  <p className="text-gray-600">평일 09:00 - 18:00</p>
                  <p className="text-gray-600">주말/공휴일: 예약제 운영</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold shrink-0">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-brand-dark mb-1">상담 방식</h2>
                  <p className="text-gray-600 break-keep">
                    방문 상담(예약제)과 전화 상담을 운영합니다. 상담료는 30분 100,000원(VAT 포함)이며, 사건을 수행할 변호사가 직접 예약제로 진행합니다.<br />
                    온라인으로 먼저 사건 개요를 남겨주시면 담당 변호사가 연락드립니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-80 lg:h-auto min-h-[320px] w-full bg-gray-200 rounded-sm overflow-hidden relative shadow-lg">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src="https://maps.google.com/maps?q=경기도+평택시+평남로+1029-1&hl=ko&z=17&output=embed"
                className="absolute inset-0 w-full h-full"
                title="법무법인 명 평택 사무실 위치 지도"
              ></iframe>
            </div>
          </div>

          {/* 주요 업무 분야 */}
          <div className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">주요 업무 분야</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRACTICE_AREA_DEFINITIONS.map((area) => (
                <Link
                  key={area.slug}
                  href={`/practice/${area.slug}`}
                  className="flex items-center justify-between px-5 py-4 bg-brand-light/50 rounded-sm border border-gray-100 hover:border-brand-gold/40 transition-all group"
                >
                  <span className="text-brand-dark font-medium group-hover:text-brand-gold transition-colors break-keep">
                    {area.title}
                  </span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-gold transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* TODO: "평택에서 자주 문의되는 사건" 섹션 — 실제 수임 분포 데이터를 사용자가 제공하면 추가 (지침 14단계 워크플로우) */}

          {/* 대표변호사 */}
          <div className="mb-16 bg-brand-light p-8 md:p-10 rounded-sm flex flex-col md:flex-row md:items-center gap-6">
            <Image
              src="/images/attorney-profile.jpg"
              alt="최철호 대표변호사"
              width={96}
              height={96}
              // 2:3 세로 원본을 정사각형으로 자르므로 기본값(중앙)이면 얼굴 윗부분이 잘린다.
              // 얼굴이 원본 상단 약 26% 지점에 있어 크롭 창을 위로 올린다.
              className="w-24 h-24 object-cover object-[50%_20%] rounded-full shadow-md shrink-0"
            />
            <div>
              <h2 className="text-xl font-serif font-bold text-brand-dark mb-2">최철호 대표변호사</h2>
              <p className="text-gray-600 text-sm leading-relaxed break-keep mb-3">
                GS건설·롯데건설 사내변호사 출신. 상담부터 변론까지 같은 변호사가 담당합니다.
              </p>
              <Link href="/attorneys/choi-cheolho" className="text-brand-gold font-bold text-sm hover:text-brand-dark transition-colors">
                프로필 보기 &rarr;
              </Link>
            </div>
          </div>

          {/* 인접 지역 */}
          <div className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">인접 지역 상담 안내</h2>
            <p className="text-gray-600 break-keep mb-6">
              법무법인 명은 평택 사무실에서 안성·오산·아산 지역의 부동산, 건설, 민사 및 형사 사건을 상담합니다.
            </p>
            <div className="flex flex-wrap gap-3">
              {SERVICE_AREAS.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="px-5 py-3 border border-gray-200 rounded-sm text-brand-dark hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  {area.name} 지역 안내
                </Link>
              ))}
            </div>
          </div>

          {/* 상담 CTA */}
          <div className="border-t border-gray-100 pt-10">
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
                eventParams={{ location: 'pyeongtaek_page' }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-brand-dark text-brand-dark font-bold rounded-sm hover:bg-brand-dark hover:text-white transition-all"
              >
                <Phone size={18} /> {ORG.telephone}
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
