import React from 'react';
import Link from 'next/link';
import { Gavel, Building2, Users, HardHat, Home, Shield } from 'lucide-react';
import { PracticeArea } from '../types';

/**
 * 업무 분야 카드 6종 — 순서 고정 (마스터 플랜 1-1)
 * 형사 → 민사 → 가사 → 부동산 → 건설·공사대금 → 기업
 * - 카드·세부 키워드 링크는 세부 페이지 8종과 동시 배포 (지침 1-1 일괄 적용)
 * - 질문형 카피는 /practice에서만 표시 (라우팅 지침 작업 2 — 홈 상황 섹션과 중복 방지)
 */
interface AreaWithKeywords extends PracticeArea {
  href: string;
  question: string;
  keywords?: { label: string; slug?: string; href?: string }[];
}

const PRIMARY_AREAS: AreaWithKeywords[] = [
  {
    id: '1',
    title: '형사 변호',
    description: '수사 초기 단계부터 공판까지 방어 전략을 수립합니다.',
    icon: Shield,
    href: '/practice/criminal',
    question: '경찰 조사를 앞두고 계시거나, 고소를 생각하고 계신가요?',
    keywords: [
      { label: '음주·교통', slug: 'criminal' },
      { label: '폭력·상해', slug: 'criminal' },
      { label: '사기·재산범죄', slug: 'criminal' },
    ],
  },
  {
    id: '2',
    title: '민사 소송',
    description: '계약 분쟁과 재산권 침해에 대응합니다.',
    icon: Gavel,
    href: '/practice/civil',
    question: '받을 돈이 있거나, 법원에서 소장을 받으셨나요?',
    keywords: [
      { label: '대여금·채권 회수', slug: 'civil' },
      { label: '손해배상', slug: 'civil' },
      { label: '계약 분쟁', slug: 'civil' },
    ],
  },
  {
    id: '3',
    title: '가사(이혼·상속)',
    description: '가족 문제를 신중하게 다룹니다.',
    icon: Users,
    href: '/practice/divorce',
    question: '이혼을 생각 중이시거나, 상속 문제가 생기셨나요?',
    keywords: [
      { label: '이혼·재산분할', slug: 'divorce' },
      { label: '양육권', slug: 'divorce' },
      // 상속 분쟁 세부 키워드 직링크 — 동시 배포 필수 항목 (마스터 플랜 1-3)
      { label: '상속 분쟁', href: '/practice/inheritance' },
    ],
  },
];

const SECONDARY_AREAS: AreaWithKeywords[] = [
  {
    id: '4',
    title: '부동산',
    description: '부동산 매매·임대차와 토지 관련 분쟁을 다룹니다.',
    icon: Home,
    href: '/practice/real-estate',
    question: '임대차·매매나 보증금 문제가 있으신가요?',
    keywords: [
      { label: '매매·임대차', slug: 'real-estate' },
      { label: '보증금 반환', slug: 'real-estate' },
      { label: '토지·상가 분쟁', slug: 'real-estate' },
    ],
  },
  {
    id: '5',
    title: '건설·공사대금',
    description: '공사 관련 분쟁을 다룹니다. GS건설·롯데건설 사내변호사 경력의 주력 분야입니다.',
    icon: HardHat,
    href: '/practice/construction',
    question: '공사대금이나 하도급대금을 받지 못하고 계신가요?',
    keywords: [
      { label: '공사대금·하도급대금', slug: 'construction' },
      { label: '하자보수', slug: 'construction' },
      { label: '건설 분쟁', slug: 'construction' },
    ],
  },
  {
    id: '6',
    title: '기업 법무',
    description: '기업 운영에 필요한 법률 자문과 분쟁 대응을 제공합니다.',
    icon: Building2,
    href: '/practice/corporate',
    question: '회사 운영 중 법률 문제가 생기셨나요?',
    keywords: [
      { label: '계약서 검토·자문', slug: 'corporate' },
      { label: '기업 분쟁 대응', slug: 'corporate' },
      { label: '인사·노동', slug: 'corporate' },
    ],
  },
];

/** 세부 키워드 목록 — href가 있는 항목만 링크 (상속 분쟁 직링크 등) */
function KeywordList({ keywords, className = '' }: { keywords: { label: string; slug?: string; href?: string }[]; className?: string }) {
  return (
    <p className={`text-xs text-gray-400 break-keep ${className}`}>
      {keywords.map((k, i) => (
        <React.Fragment key={k.label}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          {k.href ? (
            // 카드 전체 링크(stretched-link) 위에서 독립 클릭 영역 유지 (UX 수정 2)
            <Link
              href={k.href}
              className="relative z-10 hover:text-brand-gold underline decoration-gray-300 underline-offset-2"
            >
              {k.label}
            </Link>
          ) : (
            <span data-slug={k.slug}>{k.label}</span>
          )}
        </React.Fragment>
      ))}
    </p>
  );
}

export const PracticeAreas: React.FC<{ showQuestions?: boolean }> = ({ showQuestions }) => {
  // 전 카드 동일 크기, 순서는 그물 우선 현행 유지 (UX 수정 1)
  const AREAS = [...PRIMARY_AREAS, ...SECONDARY_AREAS];

  return (
    <section id="practice" className="py-16 md:py-20 bg-brand-light">
      <div className="container mx-auto px-6 md:px-12">
        {/* 제목·서브 메시지는 PageHeader가 담당 */}

        <div className="grid md:grid-cols-3 gap-6">
          {AREAS.map((area) => (
            <div
              key={area.id}
              className="relative bg-white p-8 group hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl border border-transparent hover:border-brand-gold/20"
            >
              <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mb-5 group-hover:bg-brand-gold transition-colors duration-300">
                <area.icon className="text-brand-dark group-hover:text-white transition-colors duration-300" size={28} />
              </div>
              <h2 className="text-xl lg:text-2xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand-gold transition-colors break-keep">
                {/* stretched-link — 카드 전체 클릭 영역 (UX 수정 2) */}
                <Link href={area.href} className="after:absolute after:inset-0 after:content-['']">
                  {area.title}
                </Link>
              </h2>
              {showQuestions && (
                <p className="text-sm font-medium text-[#8a6f4d] mb-3 break-keep">{area.question}</p>
              )}
              <p className="text-sm text-gray-500 leading-relaxed break-keep">
                {area.description}
              </p>
              {area.keywords && <KeywordList keywords={area.keywords} className="mt-4 pt-4 border-t border-gray-100" />}
            </div>
          ))}
        </div>

        {/* 기타 카드 대체 문장 (마스터 플랜 1-1 변경 2) */}
        <p className="mt-8 text-sm text-gray-500 break-keep">
          위 분야에 속하지 않는 사건은 상담에서 내용을 듣고 진행 가능 여부를 먼저 말씀드립니다.
        </p>
      </div>
    </section>
  );
};
