import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight, MapPin, Phone } from 'lucide-react';
import { JsonLd } from '../../../../components/JsonLd';
import { TrackedLink } from '../../../../components/TrackedLink';
import { ORG, SITE_URL } from '../../../../lib/organization';

/**
 * 인접 서비스 지역 안내 페이지 (지침 6단계).
 *
 * 금지사항 준수:
 * - 실제 지점이 있는 것처럼 표현하지 않는다 (가짜 주소·사무소 없음).
 * - 지역별 고유 콘텐츠(사용자 제공)가 등록되기 전까지 noindex 유지 —
 *   지역명만 바꾼 중복 페이지가 색인되는 것을 방지한다 (지침 14단계 워크플로우).
 */

interface ServiceArea {
  slug: string;
  name: string;
}

const SERVICE_AREAS: ServiceArea[] = [
  { slug: 'anseong', name: '안성' },
  { slug: 'osan', name: '오산' },
  { slug: 'asan', name: '아산' },
];

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return SERVICE_AREAS.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const area = SERVICE_AREAS.find((a) => a.slug === params.slug);
  if (!area) return {};
  return {
    title: { absolute: `${area.name} 지역 법률 상담 안내 | 법무법인 명` },
    description: `법무법인 명은 평택 사무실에서 ${area.name} 지역의 부동산, 건설, 민사 및 형사 사건을 상담합니다.`,
    alternates: { canonical: `/service-areas/${params.slug}` },
    // 지역별 고유 콘텐츠(사용자 제공) 등록 전까지 noindex — 중복 페이지 색인 방지
    robots: { index: false, follow: true },
  };
}

export default function ServiceAreaPage({ params }: Props) {
  const area = SERVICE_AREAS.find((a) => a.slug === params.slug);
  if (!area) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: `${area.name} 지역 안내`, item: `${SITE_URL}/service-areas/${area.slug}` },
    ],
  };

  return (
    <div className="pt-20">
      <JsonLd data={breadcrumbJsonLd} />

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="현재 위치" className="flex items-center gap-1 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-brand-gold transition-colors">홈</Link>
            <ChevronRight size={14} />
            <span className="text-brand-dark font-medium">{area.name} 지역 안내</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-8 break-keep">
            {area.name} 지역 법률 상담 안내
          </h1>

          {/* 지침 6단계 지정 문구 — 지점이 있는 것처럼 표현하지 않는다 */}
          <p className="text-lg text-gray-600 leading-relaxed break-keep mb-6">
            법무법인 명은 평택 사무실에서 안성·오산·아산 지역의
            부동산, 건설, 민사 및 형사 사건을 상담합니다.
          </p>
          <p className="text-gray-600 leading-relaxed break-keep mb-12">
            {area.name} 지역에 별도 사무소를 두고 있지 않습니다. 상담은 평택 사무실 방문
            또는 전화로 진행됩니다.
          </p>

          {/* TODO: {area.name} 지역 고유 콘텐츠(관할 법원 안내, 지역 특성 등)는
              사용자 제공 데이터로 추가 예정 (지침 14단계). 추가 후 noindex 해제. */}

          {/* 평택 사무실 안내 */}
          <div className="bg-brand-light p-8 rounded-sm mb-12">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full text-brand-gold shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h2 className="font-bold text-brand-dark mb-1">평택 사무실</h2>
                <p className="text-gray-600 mb-3">{ORG.address.full}</p>
                <Link href="/locations/pyeongtaek" className="text-brand-gold font-bold text-sm hover:text-brand-dark transition-colors">
                  오시는 길·상담 안내 보기 &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* 상담 CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-white font-bold rounded-sm hover:bg-yellow-700 shadow-lg transition-all"
            >
              온라인 상담 신청 <ArrowRight size={18} />
            </Link>
            <TrackedLink
              href="tel:0316586100"
              event="phone_click"
              eventParams={{ location: 'service_area' }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-brand-dark text-brand-dark font-bold rounded-sm hover:bg-brand-dark hover:text-white transition-all"
            >
              <Phone size={18} /> {ORG.telephone}
            </TrackedLink>
          </div>
        </div>
      </section>
    </div>
  );
}
