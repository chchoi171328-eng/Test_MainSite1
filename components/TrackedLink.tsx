'use client';

import React from 'react';
import { trackEvent } from '../lib/analytics';

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** GA4 이벤트 이름 (예: 'phone_click', 'email_click') */
  event: string;
  /** 이벤트 파라미터 (예: { location: 'contact' }) */
  eventParams?: Record<string, unknown>;
  children: React.ReactNode;
}

/**
 * 클릭 이벤트를 추적하는 <a> 래퍼 — 서버 컴포넌트에서 tel:/mailto:/외부 링크 추적에 사용.
 */
export function TrackedLink({ event, eventParams, children, ...anchorProps }: TrackedLinkProps) {
  return (
    <a {...anchorProps} onClick={() => trackEvent(event, eventParams)}>
      {children}
    </a>
  );
}
