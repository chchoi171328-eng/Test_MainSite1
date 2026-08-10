import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { TrackedLink } from './TrackedLink';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111] text-gray-400 py-16 border-t border-white/10 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-6 inline-block">
              <Logo className="h-10 w-10 text-white" textClassName="text-white" />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6 break-keep">
              법무법인 명(SOL & LUNA)은 승산 없는 소송을 권하지 않습니다.<br />
              먼저 듣고, 솔직하게 말씀드립니다.
            </p>
            {/* NAP 일관성: 이 표기는 JSON-LD와 글자 단위로 일치해야 한다 (지침 7단계) */}
            <div className="text-xs text-gray-500 space-y-2 font-light">
              <p>법무법인 명(SOL & LUNA Law Firm)</p>
              <p>경기도 평택시 평남로 1029-1, SJ프라자 5층</p>
              <p>Tel: <TrackedLink href="tel:0316586100" event="call_click" eventParams={{ location: 'footer' }} className="hover:text-brand-gold transition-colors">031-658-6100</TrackedLink></p>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span>사업자등록번호: 238-85-00581</span>
                <span className="hidden sm:inline">|</span>
                <span>광고책임변호사: 최철호</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">법인 소개</Link></li>
              <li><Link href="/attorneys/choi-cheolho" className="hover:text-brand-gold transition-colors">최철호 변호사</Link></li>
              <li><Link href="/practice" className="hover:text-brand-gold transition-colors">업무 분야</Link></li>
              <li><Link href="/fees" className="hover:text-brand-gold transition-colors">수임료 안내</Link></li>
              <li><Link href="/cases" className="hover:text-brand-gold transition-colors">성공사례</Link></li>
              <li><Link href="/tools" className="hover:text-brand-gold transition-colors">스마트 도구</Link></li>
              <li><Link href="/locations/pyeongtaek" className="hover:text-brand-gold transition-colors">평택 사무실</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">오시는 길</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-brand-gold transition-colors">이용약관</Link></li>
              <li><Link href="/email-policy" className="hover:text-brand-gold transition-colors">이메일무단수집거부</Link></li>
              <li><Link href="/disclaimer" className="hover:text-brand-gold transition-colors">면책공고</Link></li>
            </ul>
          </div>
        </div>

        {/* 관리자 접근은 /admin 직접 URL로만 — 공개 화면에 링크 노출 금지 (지침 9단계) */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} SOL & LUNA Law Firm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
