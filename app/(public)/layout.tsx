import React from 'react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { FloatingCallButton } from '../../components/FloatingCallButton';
import { JsonLd } from '../../components/JsonLd';
import { Analytics } from '../../components/Analytics';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '../../lib/organization';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 사이트 전역 구조화 데이터 — 여기서 1회만 삽입 (중복 금지, 지침 7단계) */}
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebSiteJsonLd()} />
      {/* GA4 — NEXT_PUBLIC_GA_ID 미설정 시 비활성 (지침 12단계) */}
      <Analytics />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-gold focus:text-white focus:rounded-sm focus:shadow-lg"
      >
        본문으로 건너뛰기
      </a>
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main id="main-content" role="main" className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingCallButton />
      </div>
    </>
  );
}
