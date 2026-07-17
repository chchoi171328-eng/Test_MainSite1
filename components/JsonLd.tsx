import React from 'react';

/**
 * JSON-LD 구조화 데이터 삽입 공통 컴포넌트.
 * 중복 삽입을 피하기 위해 모든 페이지는 이 컴포넌트를 통해서만 JSON-LD를 출력한다. (지침 7단계)
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
