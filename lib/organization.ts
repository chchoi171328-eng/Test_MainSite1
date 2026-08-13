/**
 * 법인 공식 정보 (NAP: Name, Address, Phone) 단일 출처.
 * 푸터·JSON-LD·about 페이지 표기는 반드시 이 상수를 기준으로 글자 단위 일치시킨다. (지침 7단계)
 * 서울 서초 소재 동명 법인과의 엔티티 구분을 위해 사업자등록번호·주소·좌표를 포함한다.
 */
export const ORG = {
  nameKo: '법무법인 명',
  nameEn: 'SOL & LUNA Law Firm',
  taxId: '238-85-00581',
  address: {
    full: '경기도 평택시 평남로 1029-1, SJ프라자 5층',
    street: '평남로 1029-1, SJ프라자 5층',
    locality: '평택시',
    region: '경기도',
    country: 'KR',
  },
  telephone: '031-658-6100',
  telephoneIntl: '+82-31-658-6100',
  email: 'sllaw@sllaw.co.kr',
  founder: '최철호',
  areaServed: ['평택시', '안성시', '오산시', '아산시'],
  openingHours: '평일 09:00-18:00, 주말/공휴일 예약제',
  englishSiteUrl: 'https://www.lsfp.co.kr/',
  // TODO: 네이버 플레이스, Google 비즈니스 프로필, 유튜브 등 공식 프로필 URL 확정 시 추가 (사용자 확인 필요)
  sameAs: ['https://www.lsfp.co.kr/'],
} as const;

// 도메인 단일 출처는 lib/site.ts — 기존 import 경로 호환을 위해 여기서 재수출한다
export { SITE_URL } from './site';
import { SITE_URL } from './site';

/** LegalService(Organization) JSON-LD — 동명 법인 구분 필드 포함 */
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${SITE_URL}/#organization`,
    name: ORG.nameKo,
    alternateName: ORG.nameEn,
    taxID: ORG.taxId,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/assets/brand/hero-court-view.webp`,
    telephone: ORG.telephoneIntl,
    email: ORG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.locality,
      addressRegion: ORG.address.region,
      addressCountry: ORG.address.country,
    },
    areaServed: ORG.areaServed.map((name) => ({ '@type': 'City', name })),
    founder: { '@id': `${SITE_URL}/attorneys/choi-cheolho#person` },
    employee: { '@id': `${SITE_URL}/attorneys/choi-cheolho#person` },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [...ORG.sameAs],
  };
}

/** WebSite JSON-LD — 사이트 전역 1회 삽입 */
export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: ORG.nameKo,
    alternateName: ORG.nameEn,
    url: SITE_URL,
    inLanguage: 'ko',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** 최철호 변호사 Person JSON-LD — 확인된 학력·경력만 포함 (지침 4단계) */
export function buildAttorneyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/attorneys/choi-cheolho#person`,
    name: '최철호',
    alternateName: 'Chulho Choi',
    jobTitle: '대표변호사',
    image: `${SITE_URL}/images/attorney-profile.jpg`,
    url: `${SITE_URL}/attorneys/choi-cheolho`,
    worksFor: { '@id': `${SITE_URL}/#organization` },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: '중앙대학교' },
      { '@type': 'CollegeOrUniversity', name: '성균관대학교 법학전문대학원' },
    ],
    knowsAbout: ['형사 변호', '민사 소송', '이혼·상속', '부동산·건설 분쟁', '기업 법무'],
    sameAs: [...ORG.sameAs],
  };
}
