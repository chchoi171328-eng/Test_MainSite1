import React from 'react';
import { Gavel, Building2, Users, FileText, Briefcase, HeartHandshake, Shield } from 'lucide-react';
import { PracticeArea } from '../types';

const AREAS: PracticeArea[] = [
  { 
    id: '1', 
    title: '기업 법무', 
    description: 'M&A, 기업 지배구조, 컴플라이언스 등 기업 운영 전반에 걸친 법률 자문을 제공합니다.',
    icon: Building2
  },
  { 
    id: '2', 
    title: '민사 소송', 
    description: '부동산, 손해배상, 계약 분쟁 등 다양한 민사 사건에서 의뢰인의 재산권을 보호합니다.',
    icon: Gavel
  },
  { 
    id: '3', 
    title: '형사 변호', 
    description: '수사 초기 단계부터 공판까지, 축적된 노하우로 최선의 방어 전략을 수립합니다.',
    icon: Shield
  },
  { 
    id: '4', 
    title: '가사 / 상속', 
    description: '이혼, 재산분할, 상속 분쟁 등 예민한 가족 문제를 섬세하고 현명하게 해결합니다.',
    icon: Users
  },
  { 
    id: '5', 
    title: '지식재산권', 
    description: '특허, 상표, 저작권 등 기업의 핵심 자산인 지식재산권을 철저하게 보호합니다.',
    icon: FileText
  },
  { 
    id: '6', 
    title: '노무 / 인사', 
    description: '부당해고, 임금체불, 산업재해 등 복잡한 노동 사건에 대한 명쾌한 솔루션을 제시합니다.',
    icon: Briefcase
  },
];

export const PracticeAreas: React.FC = () => {
  return (
    <section id="practice" className="py-20 bg-brand-light">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Practice Areas</span>
          <h2 className="text-4xl font-serif font-bold text-brand-dark">업무 분야</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AREAS.map((area) => (
            <div 
              key={area.id} 
              className="bg-white p-6 md:p-10 group hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl border border-transparent hover:border-brand-gold/20"
            >
              <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold transition-colors duration-300">
                <area.icon className="text-brand-dark group-hover:text-white transition-colors duration-300" size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4 group-hover:text-brand-gold transition-colors">
                {area.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};