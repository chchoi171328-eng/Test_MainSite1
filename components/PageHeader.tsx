import React from 'react';
import Image from 'next/image';

interface PageHeaderProps {
  /** 영문 라벨 (Playfair, 골드). 법적 고지 등 없는 페이지는 생략 */
  label?: string;
  /** 한글 페이지 제목 — h1 (명조, 흰색). 페이지당 1개 */
  title: string;
  /** 서브 문구 (Noto Sans, 흰색 80%). 없으면 생략 */
  subtitle?: string;
  /** 지정 시 이미지형, 없으면 단색형(#222 + 하단 골드 1px). 규격은 동일 */
  imageSrc?: string;
  imageAlt?: string;
}

/**
 * 전 서브 페이지 공통 헤더 밴드 (2차 v3 지침 작업 1 — 5안 포맷)
 * 홈(히어로)과 EN 페이지는 사용하지 않는다.
 *
 * 5안 구조(위→아래): 영문 라벨 / 한글 제목(h1) / 서브 문구
 * 배경 2종(이미지형·단색형)은 밴드 높이·패딩·타이포 규격이 동일하고 배경만 다르다.
 * 신규 이미지가 없는 페이지는 imageSrc를 비워 단색형으로 두고, 이미지 추가 시
 * imageSrc 경로만 넣으면 이미지형으로 전환된다.
 */
export function PageHeader({ label, title, subtitle, imageSrc, imageAlt }: PageHeaderProps) {
  return (
    <section className="relative bg-brand-dark overflow-hidden">
      {imageSrc && (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt || ''}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* 어두운 오버레이 — 텍스트 대비 확보 (약 50%) */}
          <div className="absolute inset-0 bg-black/50"></div>
        </>
      )}

      {/* 밴드 콘텐츠 — nav(고정 헤더) 높이만큼 상단 여백 포함. 좌측 정렬, 본문 컨테이너 라인 */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-28 pb-8 md:pt-32 md:pb-12 min-h-[160px] md:min-h-[240px] flex flex-col justify-center">
        {label && (
          <p className="font-serif text-xs md:text-sm tracking-[0.25em] uppercase text-brand-gold mb-2 md:mb-3">
            {label}
          </p>
        )}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-white break-keep">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-white/80 text-sm md:text-base break-keep">
            {subtitle}
          </p>
        )}
      </div>

      {/* 단색형 밴드 하단 골드 1px 라인 (이미지형에는 없음) */}
      {!imageSrc && (
        <div className="absolute bottom-0 left-0 w-full h-px bg-brand-gold" aria-hidden="true"></div>
      )}
    </section>
  );
}
