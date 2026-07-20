import React from 'react';
import { Gavel, Building2, Users, Briefcase, Home, Shield } from 'lucide-react';
import { PracticeArea } from '../types';

/**
 * 세부 키워드 (2차 개정판 작업 4-2·4-3)
 * - 현재는 링크가 아니다. 추후 <a> 전환은 KeywordList 한 곳만 수정하면 된다.
 * - data-slug는 data/practice-areas.ts의 라우트 slug와 통일한다.
 *   해당 라우트는 검수 콘텐츠(reviewedBy) 등록 전까지 noindex 상태다.
 */
interface AreaWithKeywords extends PracticeArea {
  keywords?: { label: string; slug?: string }[];
}

// TODO: 실제 수임 분포에 따라 최종 확정
const PRIMARY_AREAS: AreaWithKeywords[] = [
  {
    id: '1',
    title: '형사 변호',
    description: '수사 초기 단계부터 공판까지 방어 전략을 수립합니다.',
    icon: Shield,
    keywords: [
      { label: '음주·교통', slug: 'criminal-defense' },
      { label: '폭력·상해', slug: 'criminal-defense' },
      { label: '사기·재산범죄', slug: 'criminal-defense' },
    ],
  },
  {
    id: '2',
    title: '민사 소송',
    description: '계약 분쟁과 재산권 침해에 대응합니다.',
    icon: Gavel,
    keywords: [
      { label: '대여금·채권 회수', slug: 'debt-collection' },
      { label: '손해배상', slug: 'civil-litigation' },
      { label: '계약 분쟁', slug: 'civil-litigation' },
    ],
  },
  {
    id: '3',
    title: '가사(이혼·상속)',
    description: '가족 문제를 신중하게 다룹니다.',
    icon: Users,
    keywords: [
      { label: '이혼·재산분할', slug: 'divorce-inheritance' },
      { label: '양육권', slug: 'divorce-inheritance' },
      { label: '상속 분쟁', slug: 'divorce-inheritance' },
    ],
  },
];

const SECONDARY_AREAS: AreaWithKeywords[] = [
  {
    id: '4',
    title: '부동산·건설',
    description: '부동산과 공사 관련 분쟁을 다룹니다.',
    icon: Home,
    keywords: [
      { label: '매매·임대차', slug: 'real-estate-litigation' },
      { label: '공사대금', slug: 'construction-payment' },
      { label: '하자·건설 분쟁', slug: 'construction-disputes' },
    ],
  },
  {
    id: '5',
    title: '기업 법무',
    description: '기업 운영에 필요한 법률 자문과 분쟁 대응을 제공합니다.',
    icon: Building2,
    keywords: [
      { label: '계약서 검토·자문', slug: 'corporate-law' },
      { label: '기업 분쟁 대응', slug: 'corporate-law' },
      { label: '인사·노동', slug: 'corporate-law' },
    ],
  },
  {
    id: '6',
    title: '기타',
    description: '위 분야에 속하지 않는 사건은 상담에서 내용을 듣고 진행 가능 여부를 먼저 말씀드립니다.',
    icon: Briefcase,
  },
];

/** 세부 키워드 목록 — 링크 아님, 추후 <a> 전환 대비 개별 요소 마크업 (작업 4-3) */
function KeywordList({ keywords, className = '' }: { keywords: { label: string; slug?: string }[]; className?: string }) {
  return (
    <p className={`text-xs text-gray-400 break-keep ${className}`}>
      {keywords.map((k, i) => (
        <React.Fragment key={k.label}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          <span data-slug={k.slug}>{k.label}</span>
        </React.Fragment>
      ))}
    </p>
  );
}

export const PracticeAreas: React.FC = () => {
  return (
    <section id="practice" className="py-16 md:py-20 bg-brand-light">
      <div className="container mx-auto px-6 md:px-12">
        {/* 제목·서브 메시지는 PageHeader가 담당 */}

        {/* 주력 분야 */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {PRIMARY_AREAS.map((area) => (
            <div
              key={area.id}
              className="bg-white p-8 lg:p-10 group hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl border border-transparent hover:border-brand-gold/20"
            >
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold transition-colors duration-300">
                <area.icon className="text-brand-dark group-hover:text-white transition-colors duration-300" size={32} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-brand-dark mb-4 group-hover:text-brand-gold transition-colors break-keep">
                {area.title}
              </h2>
              <p className="text-gray-500 leading-relaxed break-keep">
                {area.description}
              </p>
              {area.keywords && <KeywordList keywords={area.keywords} className="mt-4 pt-4 border-t border-gray-100" />}
            </div>
          ))}
        </div>

        {/* 그 외 분야 */}
        <div className="grid md:grid-cols-3 gap-6">
          {SECONDARY_AREAS.map((area) => (
            <div
              key={area.id}
              className="bg-white/70 p-6 group hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-brand-gold/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-300 shrink-0">
                  <area.icon className="text-brand-dark group-hover:text-white transition-colors duration-300" size={20} />
                </div>
                <h2 className="text-lg font-serif font-bold text-brand-dark group-hover:text-brand-gold transition-colors break-keep">
                  {area.title}
                </h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed break-keep">
                {area.description}
              </p>
              {area.keywords && <KeywordList keywords={area.keywords} className="mt-3 pt-3 border-t border-gray-100" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
