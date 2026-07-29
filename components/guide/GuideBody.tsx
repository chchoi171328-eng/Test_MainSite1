import React from 'react';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {
  GuideSummary,
  GuideToc,
  Term,
  Caption,
  Callout,
  GuideFlow,
  Step,
  GuideDeadline,
  Item,
  GuideFaq,
  Q,
  A,
} from './GuideComponents';

/**
 * MDX 본문 렌더러.
 * 기본 요소 스타일은 guide-sample-myeongdo.html의 타이포·간격을 따른다.
 * 헤딩 ID는 lib/content.ts의 withHeadingIds()가 컴파일 전에 <h2 id="..."> 로 주입하며,
 * 같은 규칙을 쓰는 extractToc()의 목차 앵커와 반드시 일치한다.
 */

const components = {
  GuideSummary,
  Term,
  Caption,
  Callout,
  GuideFlow,
  Step,
  GuideDeadline,
  Item,
  GuideFaq,
  Q,
  A,

  // withHeadingIds()가 `## 제목 {#id}` 를 <GuideH2 id num>으로 변환해 내려보낸다
  // (원시 <h2> 태그는 MDX components 매핑을 타지 않아 커스텀 컴포넌트를 쓴다)
  GuideH2: ({ id, num, children }: { id: string; num?: string; children: React.ReactNode }) => (
    <h2
      id={id}
      className="font-serif text-[21.5px] md:text-[25px] font-semibold text-brand-dark mt-12 md:mt-14 mb-6 break-keep scroll-mt-24"
    >
      {num && <span className="text-brand-gold mr-2.5">{num}.</span>}
      {children}
    </h2>
  ),
  h2: (props: React.ComponentProps<'h2'>) => (
    <h2
      {...props}
      className="font-serif text-[21.5px] md:text-[25px] font-semibold text-brand-dark mt-12 md:mt-14 mb-6 break-keep scroll-mt-24"
    />
  ),
  h3: (props: React.ComponentProps<'h3'>) => (
    <h3 {...props} className="text-[16.5px] font-semibold text-[#2c2c2c] mt-7 mb-2.5 break-keep" />
  ),
  p: (props: React.ComponentProps<'p'>) => (
    <p {...props} className="text-[15.5px] mb-4 text-[#3a3a3a] break-keep leading-[1.88]" />
  ),
  strong: (props: React.ComponentProps<'strong'>) => (
    <strong {...props} className="font-semibold text-[#1c1c1c]" />
  ),
  ul: (props: React.ComponentProps<'ul'>) => <ul {...props} className="list-none mb-4" />,
  li: (props: React.ComponentProps<'li'>) => (
    <li
      {...props}
      className="relative pl-4 text-[15.3px] text-[#3a3a3a] leading-[2] break-keep before:content-['·'] before:absolute before:left-0 before:text-brand-gold"
    />
  ),
  a: (props: React.ComponentProps<'a'>) => (
    <a {...props} className="text-brand-dark underline decoration-brand-gold/50 underline-offset-2 hover:decoration-brand-gold" />
  ),
  table: (props: React.ComponentProps<'table'>) => (
    <div className="overflow-x-auto my-6">
      <table {...props} className="w-full border-collapse text-[13.5px] md:text-[14.8px]" />
    </div>
  ),
  th: (props: React.ComponentProps<'th'>) => (
    <th
      {...props}
      className="bg-[#f7f5f1] border-t-2 border-brand-dark border-b border-[#e7e3db] py-3 px-2 md:px-3.5 text-left font-bold text-brand-dark break-keep"
    />
  ),
  td: (props: React.ComponentProps<'td'>) => (
    <td
      {...props}
      className="border-b border-[#f0ece4] py-3 px-2 md:px-3.5 align-top text-[#3a3a3a] break-keep first:font-medium first:text-[#1c1c1c]"
    />
  ),
  figure: (props: React.ComponentProps<'figure'>) => <figure {...props} className="my-8" />,
  img: ({ src, alt }: React.ComponentProps<'img'>) => (
    <span className="block my-8">
      <Image
        src={typeof src === 'string' ? src : ''}
        alt={alt || ''}
        width={1200}
        height={675}
        className="w-full h-auto rounded-sm"
      />
      {alt && <span className="block text-xs text-[#a8a294] mt-2 break-keep">{alt}</span>}
    </span>
  ),
  hr: () => <hr className="my-10 border-t border-[#e7e3db]" />,
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote {...props} className="border-l-[3px] border-brand-gold pl-4 my-6 text-[#4a4a4a] break-keep" />
  ),
};

export function GuideBody({
  source,
  toc,
}: {
  source: string;
  /** 본문 H2에서 추출한 목차 — MDX에서 <GuideToc />로 삽입한다 */
  toc: { id: string; text: string }[];
}) {
  return (
    <MDXRemote
      source={source}
      components={{
        ...components,
        // MDX에서는 인자 없이 <GuideToc /> 로 쓰고, 항목은 서버가 주입한다
        GuideToc: () => <GuideToc items={toc} />,
      }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  );
}
