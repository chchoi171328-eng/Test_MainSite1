'use client';

import React from 'react';
import { DataProvider } from '../../contexts/DataContext';
import { Admin } from '../../components/Admin';

// 관리자 페이지: 공개 레이아웃(내비게이션·푸터) 없이 렌더링, 색인 차단은 layout.tsx metadata에서 처리
export default function AdminPage() {
  return (
    <DataProvider>
      <Admin />
    </DataProvider>
  );
}
