import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://test-main-site1.vercel.app';

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
    images: ['/assets/brand/hero-court-view.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '평택 변호사 최철호 | 부동산·건설·민사소송 | 법무법인 명',
    description:
      '평택 소재 법무법인 명. 최철호 대표변호사가 부동산 분쟁, 건설·공사대금, 대여금·채권, 민사소송, 형사 및 가사 사건을 상담합니다.',
    images: ['/assets/brand/hero-court-view.webp'],
  },
  // 정식 도메인 연결 전까지 개발 도메인은 색인 차단 (지침 3단계)
  robots: process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'
    ? { index: true, follow: true }
    : { index: false, follow: false },
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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
