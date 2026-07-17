import React from 'react';
import Link from 'next/link';
import { Gavel, Building2, Users, Briefcase, Home, Shield, ChevronRight } from 'lucide-react';
import { PracticeArea } from '../types';
import { PRACTICE_AREA_DEFINITIONS } from '../data/practice-areas';

// TODO: 실제 수임 분포에 따라 최종 확정
const PRIMARY_AREAS: PracticeArea[] = [
  {
    id: '1',
    title: '형사 변호',
    description: '수사 초기 단계부터 공판까지, 축적된 노하우로 최선의 방어 전략을 수립합니다.',
    icon: Shield
  },
  {
    id: '2',
    title: '민사 소송',
    description: '부동산, 손해배상, 계약 분쟁 등 다양한 민사 사건에서 의뢰인의 재산권을 보호합니다.',
    icon: Gavel
  },
  {
    id: '3',
    title: '가사(이혼·상속)',
    description: '이혼, 재산분할, 상속 분쟁 등 예민한 가족 문제를 섬세하고 현명하게 해결합니다.',
    icon: Users
  },
];

const SECONDARY_AREAS: PracticeArea[] = [
  {
    id: '4',
    title: '부동산·건설',
    description: '부동산 매매·임대차 분쟁과 건설 관련 분쟁을 다룹니다.',
    icon: Home
  },
  {
    id: '5',
    title: '기업 법무',
    description: 'M&A, 기업 지배구조, 컴플라이언스 등 기업 운영 전반에 걸친 법률 자문을 제공합니다. 지식재산권, 인사·노동 자문을 포함합니다.',
    icon: Building2
  },
  {
    id: '6',
    title: '기타',
    description: '위 분야에 속하지 않는 사건은 상담에서 내용을 듣고 진행 가능 여부를 먼저 말씀드립니다.',
    icon: Briefcase
  },
];

export const PracticeAreas: React.FC = () => {
  return (
    <section id="practice" className="py-20 bg-brand-light">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Practice Areas</span>
          <h1 className="text-4xl font-serif font-bold text-brand-dark">업무 분야</h1>
        </div>

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
              <h3 className="text-2xl lg:text-3xl font-serif font-bold text-brand-dark mb-4 group-hover:text-brand-gold transition-colors break-keep">
                {area.title}
              </h3>
              <p className="text-gray-500 leading-relaxed break-keep">
                {area.description}
              </p>
            </div>
          ))}
        </div>

        {/* 그 외 분야 */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {SECONDARY_AREAS.map((area) => (
            <div
              key={area.id}
              className="bg-white/70 p-6 group hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-brand-gold/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-300 shrink-0">
                  <area.icon className="text-brand-dark group-hover:text-white transition-colors duration-300" size={20} />
                </div>
                <h3 className="text-lg font-serif font-bold text-brand-dark group-hover:text-brand-gold transition-colors break-keep">
                  {area.title}
                </h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed break-keep">
                {area.description}
              </p>
            </div>
          ))}
        </div>

        {/* 세부 분야 상세 안내 */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-serif font-bold text-brand-dark mb-6 text-center">세부 분야 안내</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRACTICE_AREA_DEFINITIONS.map((area) => (
              <Link
                key={area.slug}
                href={`/practice/${area.slug}`}
                className="flex items-center justify-between px-5 py-4 bg-white rounded-sm border border-gray-100 hover:border-brand-gold/40 hover:shadow-sm transition-all group"
              >
                <span className="text-brand-dark font-medium group-hover:text-brand-gold transition-colors break-keep">
                  {area.title}
                </span>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-gold transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
