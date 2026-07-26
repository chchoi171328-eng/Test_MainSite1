import React, { isValidElement } from 'react';
import Link from 'next/link';
import { JsonLd } from '../JsonLd';

/**
 * 가이드 본문 MDX 컴포넌트 (지침 작업 4)
 * 시각 정본: docs/Info_board/guide-sample-myeongdo.html
 * — 구조·간격·위계는 정본 그대로, 색은 사이트 토큰(brand-gold/brand-dark)으로 매핑
 */

/** 요약 박스 — 히어로 직후, 도입보다 앞 (표준 3-1) */
export function GuideSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f8f6f2] border-l-[3px] border-brand-gold py-6 px-6 md:px-7 my-8">
      <div className="text-xs tracking-[0.14em] text-brand-gold font-bold mb-3">요약</div>
      <div className="guide-summary-list">{children}</div>
    </div>
  );
}

/** 목차 — H2에서 자동 생성, 영문 앵커 (표준 3-2) */
export function GuideToc({ items }: { items: { id: string; text: string }[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="border border-[#e7e3db] rounded-sm py-5 px-6 mt-7 mb-2" aria-label="목차">
      <div className="text-[13px] font-bold text-brand-dark mb-3">목차</div>
      <ol className="list-none [counter-reset:t]">
        {items.map((item) => (
          <li key={item.id} className="[counter-increment:t] text-[14.5px] leading-[2.05]">
            <span className="text-brand-gold font-semibold mr-2">
              {items.indexOf(item) + 1}.
            </span>
            <a href={`#${item.id}`} className="text-[#444] hover:text-brand-dark hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** 용어 풀이 — 첫 등장 시 일상어 설명 (표준 4) */
export function Term({ children }: { children: React.ReactNode }) {
  return <span className="text-[#6b6b6b] text-[14.5px]">{children}</span>;
}

/** 이미지 캡션 — 장식이 아니라 정보를 싣는다 (표준 7) */
export function Caption({ children }: { children: React.ReactNode }) {
  return <figcaption className="text-xs text-[#a8a294] mt-2 text-left break-keep">{children}</figcaption>;
}

/** 경고·주의 박스 (표준 3-6) */
export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fdf9f0] border border-[#efe3c9] py-[18px] px-[22px] my-6 text-[14.8px] text-[#5a4c30] rounded-sm leading-[1.85] break-keep">
      {children}
    </div>
  );
}

/**
 * 절차 도식 — 이미지가 아닌 HTML (표준 3-4)
 * 사용: <GuideFlow><Step name="단계명">설명</Step>…</GuideFlow>
 */
export function Step({ children }: { name: string; children?: React.ReactNode }) {
  return <>{children}</>;
}

export function GuideFlow({
  title = '전체 절차 흐름',
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const steps = React.Children.toArray(children).filter(
    (n): n is React.ReactElement<{ name: string; children?: React.ReactNode }> =>
      isValidElement(n) && n.type === Step
  );
  if (steps.length === 0) return null;

  return (
    <div className="my-7 border border-[#e7e3db] rounded-sm overflow-hidden">
      <div className="bg-[#f8f6f2] py-3 px-5 text-[13px] font-semibold text-brand-dark border-b border-[#e7e3db]">
        {title}
      </div>
      <ol className="list-none">
        {steps.map((step, i) => (
          <li
            key={step.props.name}
            className="relative py-[15px] pr-5 pl-[60px] border-b border-[#f2efe9] last:border-b-0 text-[14.8px] leading-[1.7]"
          >
            <span className="absolute left-5 top-4 w-6 h-6 bg-brand-dark text-white rounded-full text-xs flex items-center justify-center font-bold">
              {i + 1}
            </span>
            <b className="block font-semibold text-[#1c1c1c] mb-0.5 break-keep">{step.props.name}</b>
            {step.props.children && (
              <span className="text-[#767065] text-[13.6px] break-keep">{step.props.children}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * 기한 박스 — 다크 배경, 마지막은 확인 권유 (표준 3-5)
 * 사용: <GuideDeadline note="…"><Item term="항목">기한</Item>…</GuideDeadline>
 */
export function Item({ children }: { term: string; children?: React.ReactNode }) {
  return <>{children}</>;
}

export function GuideDeadline({
  children,
  note,
}: {
  children: React.ReactNode;
  note?: string;
}) {
  const items = React.Children.toArray(children).filter(
    (n): n is React.ReactElement<{ term: string; children?: React.ReactNode }> =>
      isValidElement(n) && n.type === Item
  );
  if (items.length === 0) return null;

  return (
    <div className="bg-[#20242c] text-white py-[26px] px-7 my-9 rounded-sm">
      <div className="text-xs tracking-[0.14em] text-brand-gold font-bold mb-3.5">기한과 시점</div>
      <dl className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-5 gap-y-0.5 md:gap-y-[11px] text-[14.5px]">
        {items.map((item) => (
          <React.Fragment key={item.props.term}>
            <dt className="text-white/60 whitespace-nowrap mt-2.5 md:mt-0">{item.props.term}</dt>
            <dd className="text-white font-medium break-keep">{item.props.children}</dd>
          </React.Fragment>
        ))}
      </dl>
      {note && (
        <div className="mt-4 pt-3.5 border-t border-white/15 text-[12.8px] text-white/60 font-light leading-[1.8] break-keep">
          {note}
        </div>
      )}
    </div>
  );
}

/** FAQ 문항 — GuideFaq 안에서 Q/A 쌍으로 사용 */
export function Q({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function A({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** React 노드에서 순수 텍스트 추출 (JSON-LD용) */
function nodeToText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (isValidElement(node)) {
    return nodeToText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

/**
 * FAQ 아코디언 + FAQPage JSON-LD 자동 생성 (표준 3-7, 지침 작업 8-2)
 * 사용: <GuideFaq><Q>질문</Q><A>답변</A>...</GuideFaq>
 */
export function GuideFaq({ children }: { children: React.ReactNode }) {
  const nodes = React.Children.toArray(children).filter(isValidElement);

  const pairs: { q: React.ReactNode; a: React.ReactNode }[] = [];
  let pendingQ: React.ReactNode = null;
  for (const node of nodes) {
    const type = (node as React.ReactElement).type;
    if (type === Q) {
      pendingQ = (node.props as { children?: React.ReactNode }).children;
    } else if (type === A && pendingQ !== null) {
      pairs.push({ q: pendingQ, a: (node.props as { children?: React.ReactNode }).children });
      pendingQ = null;
    }
  }

  if (pairs.length === 0) return null;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: pairs.map((p) => ({
            '@type': 'Question',
            name: nodeToText(p.q),
            acceptedAnswer: { '@type': 'Answer', text: nodeToText(p.a) },
          })),
        }}
      />
      <div className="mt-3.5 border-t border-[#e7e3db]">
        {pairs.map((p, i) => (
          <details key={i} className="group border-b border-[#e7e3db]">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden relative py-[17px] pr-8 text-[15.3px] font-medium text-[#2c2c2c] break-keep">
              {p.q}
              <span className="absolute right-1 top-4 text-brand-gold text-lg font-light group-open:hidden" aria-hidden="true">
                +
              </span>
              <span className="absolute right-1 top-4 text-brand-gold text-lg font-light hidden group-open:inline" aria-hidden="true">
                −
              </span>
            </summary>
            <div className="pb-5 text-[14.8px] text-[#4a4a4a] leading-[1.95] break-keep">{p.a}</div>
          </details>
        ))}
      </div>
    </>
  );
}

/** 법률 정보 안내 — 고정 문구 (표준 3-8) */
export function LegalDisclaimer() {
  return (
    <div className="bg-[#f8f8f6] border border-[#eceae4] py-5 px-[22px] mt-10 text-[13.5px] text-[#6b6b6b] leading-[1.9] rounded-sm break-keep">
      <div className="font-semibold text-[#4a4a4a] mb-[7px] text-sm">법률 정보 안내</div>
      이 글은 일반적인 법률 정보 제공을 목적으로 하며, 개별 사안에 대한 법률 자문이 아닙니다. 법령은
      수시로 개정되며, 구체적인 결론은 개별 사건의 사실관계에 따라 달라질 수 있습니다. 본인의 상황에
      대한 정확한 판단이 필요하시면 변호사와 상담하시기 바랍니다.
    </div>
  );
}

/** 함께 보면 좋은 자료 (표준 3-9) — 세부 페이지가 항상 첫 항목 */
export function GuideRelated({
  items,
}: {
  items: { label: string; tag: string; href: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-10 border-t-2 border-brand-dark pt-[22px]">
      <div className="text-sm font-bold text-brand-dark mb-3">함께 보면 좋은 자료</div>
      {items.map((item) => (
        <Link
          key={item.href + item.label}
          href={item.href}
          className="flex justify-between items-center gap-4 py-[13px] border-b border-[#f2efe9] text-[#333] text-[14.8px] hover:text-brand-dark transition-colors break-keep"
        >
          <span>{item.label}</span>
          <span className="text-[11.5px] text-[#8a8578] tracking-[0.06em] shrink-0">{item.tag}</span>
        </Link>
      ))}
    </div>
  );
}

/** 브랜드 앵커 CTA — 고정 블록, {상황 한 줄}만 교체 (표준 3-10) */
export function BrandCta({ topic, what }: { topic: string; what: string }) {
  return (
    <div className="bg-[#f8f6f2] py-[34px] px-[30px] mt-10 rounded-sm">
      <div className="font-serif text-[19px] text-[#1c1c1c] mb-3.5 break-keep">
        정직하게 말씀드리는 법률 상담
      </div>
      <p className="text-[15px] text-[#4a4a4a] mb-5 break-keep">
        법무법인 명은 모든 사건을 맡지는 않습니다. 승산 없는 소송은 권하지 않습니다. {topic}, {what}부터
        정직하게 말씀드리겠습니다. 사무소는 경기도 평택시에 있습니다.
      </p>
      <div className="flex gap-3 flex-wrap">
        <a
          href="tel:0316586100"
          className="bg-brand-dark text-white py-[13px] px-[26px] no-underline text-[14.5px] font-medium rounded-sm hover:bg-black transition-colors"
        >
          031-658-6100
        </a>
        <Link
          href="/consultation"
          className="border border-brand-dark text-brand-dark py-[13px] px-[26px] no-underline text-[14.5px] rounded-sm hover:bg-brand-dark hover:text-white transition-colors"
        >
          온라인 상담 신청
        </Link>
      </div>
    </div>
  );
}

/** 푸터 메타 — 검토일만, 발행일 표기 금지 (표준 3-11) */
export function GuideMeta({ author, reviewedAtLabel }: { author: string; reviewedAtLabel: string }) {
  return (
    <div className="mt-10 pt-[22px] pb-16 border-t border-[#e7e3db] text-[12.8px] text-[#8a8578] leading-[1.95] break-keep">
      <b className="text-[#5a5548] font-medium">작성 ·</b> {author} 변호사 (법무법인 명, 대한변호사협회
      등록 형사법·민사법 전문변호사)
      <br />
      <b className="text-[#5a5548] font-medium">검토 ·</b> {reviewedAtLabel} 기준으로 내용을
      확인했습니다. 법령·판례 변경 시 갱신합니다.
    </div>
  );
}
