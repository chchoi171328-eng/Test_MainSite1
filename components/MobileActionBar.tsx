'use client';

import React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { CallLink } from './CallLink';

/**
 * 모바일 전용 하단 고정 액션 바 (mobile-actionbar-preview.html 시안) — 구 원형
 * 전화 FAB(FloatingCallButton)를 대체한다. 데스크톱(md 이상)은 헤더의 상담 예약
 * 버튼이 있으므로 렌더하지 않는다.
 * z-40: 모바일 메뉴 오버레이는 z-50 네비 스택 안에 있어 메뉴가 열리면 바를 덮는다.
 */
export const MobileActionBar: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-white shadow-[0_-4px_16px_rgba(20,25,35,0.08)] pb-[env(safe-area-inset-bottom)]">
      <CallLink
        location="action_bar"
        className="flex-1 flex items-center justify-center gap-[7px] h-[54px] bg-white border-t border-[#e7e3db] text-[#1e3a5f] text-[14.5px] font-medium"
      >
        <Phone size={16} />
        031-658-6100
      </CallLink>
      <Link
        href="/consultation"
        onClick={() => trackEvent('booking_click', { location: 'action_bar' })}
        className="flex-1 flex items-center justify-center h-[54px] bg-brand-gold text-white text-[14.5px] font-semibold tracking-[0.02em]"
      >
        상담 예약
      </Link>
    </div>
  );
};
