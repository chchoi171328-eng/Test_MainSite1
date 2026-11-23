'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNaverTrackingSite, recordNaverPageView } from '../lib/analytics';

export function NaverAnalytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isNaverTrackingSite()) {
      setEnabled(true);
      recordNaverPageView();
    }
  }, [pathname]);

  return enabled ? (
    <Script
      id="naver-conversion-tracking"
      src="https://wcs.naver.net/wcslog.js"
      strategy="afterInteractive"
      onReady={recordNaverPageView}
    />
  ) : null;
}
