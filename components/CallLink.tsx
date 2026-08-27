'use client';

import React from 'react';
import { trackCallClick } from '../lib/analytics';
import { ORG } from '../lib/organization';

/** 사이트 전역에서 쓰는 전화 링크 href — 표기는 ORG.telephone, href는 숫자만 */
export const TEL_HREF = `tel:${ORG.telephone.replace(/-/g, '')}`;

interface CallLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** 클릭이 일어난 UI 지점 (action_bar, footer, practice_cta 등) */
  location: string;
  children: React.ReactNode;
}

/**
 * 전화 링크 단일 컴포넌트 (GOOGLE_ADS_CONVERSION_BRIEF A-1).
 *
 * 사이트의 모든 tel: 링크는 이 컴포넌트를 쓴다 — href를 직접 쓰지 않으므로
 * 새 tel: 링크를 추가할 때 추적 배선이 빠질 구조적 여지가 없다.
 * 발화는 trackCallClick 한 곳에서: GA4 call_click(event_label=경로) +
 * 네이버 CTS custom001.
 */
export function CallLink({ location, children, ...anchorProps }: CallLinkProps) {
  return (
    <a {...anchorProps} href={TEL_HREF} onClick={() => trackCallClick(location)}>
      {children}
    </a>
  );
}
