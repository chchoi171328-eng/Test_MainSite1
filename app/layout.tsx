import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { SITE_URL, ALLOW_INDEXING } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '평택 변호사 최철호 | 부동산·건설·민사소송 | 법무법인 명',
    template: '%s | 법무법인 명',
  },
  description:
    '평택 소재 법무법인 명. 최철호 대표변호사가 부동산 분쟁, 건설·공사대금, 대여금·채권, 민사소송, 형사 및 가사 사건을 상담합니다.',
  icons: { icon: '/images/logo.png' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '법무법인 명(SOL & LUNA)',
    // './'는 metadataBase 기준으로 현재 경로에 해석된다 — 페이지마다 og:url이 canonical과 같아진다
    url: './',
    images: ['/assets/brand/hero-court-view.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '평택 변호사 최철호 | 부동산·건설·민사소송 | 법무법인 명',
    description:
      '평택 소재 법무법인 명. 최철호 대표변호사가 부동산 분쟁, 건설·공사대금, 대여금·채권, 민사소송, 형사 및 가사 사건을 상담합니다.',
    images: ['/assets/brand/hero-court-view.webp'],
  },
  // 프리뷰 배포·명시적 차단 시에만 noindex (lib/site.ts ALLOW_INDEXING)
  robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  // 검색엔진 소유권 인증 — 환경변수 미설정 시 태그 자체가 출력되지 않음
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
    ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION && {
      other: { 'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION },
    }),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
