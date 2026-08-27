import React from 'react';
import Link from 'next/link';
import { JsonLd } from '../JsonLd';
import { CallLink } from '../CallLink';

/** 세부 페이지 공통 컨테이너 (미리보기 .wrap = 880px) */
export function PWrap({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[880px] mx-auto px-6">{children}</div>;
}

/** §1 헤더 — 단색형(#222 + 하단 골드 1px), 브레드크럼 + 명조 h1 + 서브 문구 */
export function PracticeHeader({
  crumb,
  title,
  sub,
}: {
  crumb: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="bg-brand-dark border-b border-brand-gold pt-28 pb-11 md:pt-36 md:pb-12">
      <PWrap>
        <div className="text-xs text-white/55 tracking-[0.06em] mb-3.5">
          업무 분야 <b className="text-brand-gold font-medium">›</b> {crumb}
        </div>
        <h1 className="font-serif text-[26px] md:text-[34px] font-bold text-white tracking-[-0.01em] break-keep">
          {title}
        </h1>
        <div className="mt-3 text-[13.5px] md:text-[15px] text-white/[.78] font-light break-keep">{sub}</div>
      </PWrap>
    </div>
  );
}

/** 공통 섹션 래퍼 — 제목(h2 명조)·리드 문구·구분선 */
export function PSection({
  title,
  lead,
  id,
  tinted,
  children,
}: {
  title?: string;
  lead?: string;
  id?: string;
  /** 연배경(#faf9f6) 강조 섹션 (AnchorSection) */
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`py-[42px] md:py-14 border-t border-[#f2efe9] first:border-t-0 scroll-mt-16 ${tinted ? 'bg-[#faf9f6]' : ''}`}
    >
      <PWrap>
        {title && (
          <h2 className="font-serif text-[22px] font-bold text-brand-dark mb-2 break-keep">{title}</h2>
        )}
        {lead && <div className="text-[13.5px] text-[#999] font-light mb-6 break-keep">{lead}</div>}
        {children}
      </PWrap>
    </section>
  );
}

/** 본문 문단 (미리보기 p.body) */
export function PBody({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[14.5px] md:text-[15.5px] leading-[1.9] text-[#3a3a3a] mb-4 max-w-[660px] break-keep ${className}`}
    >
      {children}
    </p>
  );
}

/** §3 상황 리스트 — 원형 불릿, 그룹 구분(grp) 지원 */
export function SituationList({
  items,
}: {
  items: { text: React.ReactNode; grp?: boolean }[];
}) {
  return (
    <ul className="max-w-[660px]">
      {items.map((item, i) => (
        <li
          key={i}
          className={`list-none py-[13px] pl-[26px] relative text-[15px] text-[#444] border-b border-[#f4f1ea] last:border-b-0 break-keep before:content-[''] before:absolute before:left-0.5 before:w-2 before:h-2 before:border-[1.5px] before:border-brand-gold before:rounded-full ${
            item.grp
              ? 'mt-3.5 pt-[22px] border-t border-[#eae4d8] before:top-[31px]'
              : 'before:top-[22px]'
          }`}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
}

/** §4 타임라인 — 번호 원형 + 단계명(명조) + 설명 + "할 수 있는 것" 박스 */
export function ProcedureTimeline({
  steps,
  close,
}: {
  steps: { title: string; desc: React.ReactNode; can?: React.ReactNode }[];
  close?: React.ReactNode;
}) {
  return (
    <>
      <div className="max-w-[680px] mt-2.5">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`relative pl-[54px] pb-[34px] ${
              i < steps.length - 1
                ? "after:content-[''] after:absolute after:left-[17px] after:top-[34px] after:bottom-0 after:w-px after:bg-[#e5dfd2]"
                : ''
            }`}
          >
            <div className="absolute left-0 top-0 w-[34px] h-[34px] border border-brand-gold rounded-full flex items-center justify-center font-serif text-sm text-brand-gold bg-white">
              {i + 1}
            </div>
            <h3 className="font-serif text-[16.5px] font-bold text-brand-dark pt-[5px] break-keep">{step.title}</h3>
            <div className="mt-1.5 text-sm text-[#666] leading-[1.75] font-light break-keep">{step.desc}</div>
            {step.can && (
              <div className="mt-2 text-[13.5px] leading-[1.7] text-[#8a6f4d] bg-[#faf7f1] py-2.5 px-3.5 rounded-[3px] inline-block break-keep">
                {step.can}
              </div>
            )}
          </div>
        ))}
      </div>
      {close && (
        <div className="mt-1.5 text-[15px] text-brand-dark font-medium max-w-[660px] leading-[1.8] break-keep">
          {close}
        </div>
      )}
    </>
  );
}

export interface FaqItem {
  q: string;
  /** 화면 표시용 (마크업 허용) */
  a: React.ReactNode;
  /** JSON-LD용 순수 텍스트. a가 문자열이면 생략 가능 */
  aText?: string;
}

/** §6 FAQ — details/summary 시맨틱 + FAQPage JSON-LD */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.aText ?? (typeof f.a === 'string' ? f.a : ''),
            },
          })),
        }}
      />
      <div className="max-w-[680px]">
        {items.map((f) => (
          <details key={f.q} className="group border-b border-[#eee9df]">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex justify-between items-center gap-4 py-[18px] px-0.5 text-[15.5px] font-medium text-brand-dark break-keep">
              {f.q}
              <span className="text-brand-gold text-lg shrink-0 group-open:hidden" aria-hidden="true">+</span>
              <span className="text-brand-gold text-lg shrink-0 hidden group-open:inline" aria-hidden="true">−</span>
            </summary>
            <div className="pb-5 px-0.5 text-[14.5px] leading-[1.85] text-[#555] font-light max-w-[620px] break-keep">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

/** §8 수임료 박스 — 금액(명조) → 부가세 註 → 설명 → 약속 문구 → 전문분야(옵션) */
export function FeeBox({
  amount,
  children,
  promise = '상담 후 승산이 낮다고 판단되면 수임을 권하지 않습니다.',
  cert,
}: {
  amount: string;
  children?: React.ReactNode;
  promise?: React.ReactNode;
  /** 전문분야 한 줄 표기 (마스터 플랜 2-1: 형사·피해자·민사·부동산·건설만 true) */
  cert?: boolean;
}) {
  return (
    <div className="max-w-[660px] border border-[#eae6df] rounded p-6 md:py-[26px] md:px-7">
      <div className="font-serif text-[19px] font-bold text-brand-dark break-keep">{amount}</div>
      <div className="mt-1.5 text-xs text-[#aaa]">표시 금액은 부가세(VAT) 별도입니다.</div>
      {children}
      <div className="mt-3.5 pt-3.5 border-t border-[#f0ece4] text-[14.5px] text-brand-dark font-medium break-keep">
        {promise}
      </div>
      {cert && (
        <div className="mt-2.5 text-[12.5px] text-[#999] break-keep">
          최철호 변호사는 대한변호사협회 등록 형사법·민사법 전문변호사입니다.
        </div>
      )}
    </div>
  );
}

/** 수임료 박스 안 설명 문단 */
export function FeeText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-[1.8] text-[#555] font-light mt-2.5 break-keep">{children}</p>;
}

/** "더 보기 →" 링크 */
export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-block mt-5 text-[13.5px] text-brand-gold font-medium hover:underline">
      {children}
    </Link>
  );
}

/** §9 도구·글 링크 목록 */
export function ResourceList({
  items,
}: {
  items: { label: string; tag: string; href: string }[];
}) {
  return (
    <div className="max-w-[660px]">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex justify-between items-center gap-4 py-3.5 px-0.5 border-b border-[#f2efe9] text-[#444] text-[14.5px] hover:text-brand-dark transition-colors break-keep"
        >
          <span>{item.label}</span>
          <span className="text-[11px] text-[#b0a893] tracking-[0.04em] shrink-0">{item.tag}</span>
        </Link>
      ))}
    </div>
  );
}

/**
 * §10 CTA — 다크 배경, 리드 + 전화/온라인 버튼 + 지역 문구
 * note: 하단 지역 안내 문구 override (특화 페이지 전용 — 미지정 시 공통 문구 유지)
 */
export function PracticeCta({ lead, note }: { lead: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="bg-brand-dark py-[60px]">
      <PWrap>
        <div className="font-serif text-lg md:text-[21px] font-semibold text-white leading-[1.7] max-w-[600px] break-keep">
          {lead}
        </div>
        <div className="flex gap-3 mt-6 flex-wrap">
          <CallLink
            location="practice_cta"
            className="font-serif text-lg text-white border border-white/35 py-[11px] px-[22px] rounded-sm no-underline hover:border-white/70 transition-colors"
          >
            031-658-6100
          </CallLink>
          <Link
            href="/consultation"
            className="bg-brand-gold text-white text-sm font-bold py-[13px] px-6 rounded-sm no-underline flex items-center hover:bg-opacity-90 transition-colors"
          >
            온라인 상담 신청
          </Link>
        </div>
        <div className="mt-6 text-[12.5px] text-white/50 leading-[1.8] max-w-[620px] break-keep">
          {note ?? (
            <>
              법무법인 명(SOL &amp; LUNA)은 경기도 평택시 소재 법무법인으로, 필요할 때 바로 만나고
              법원에 직접 출석할 수 있는 평택·수원·안성·오산·아산 지역의 사건을 상담합니다.
            </>
          )}
        </div>
      </PWrap>
    </div>
  );
}
