import React from 'react';
import { Attorney } from '../types';

const ATTORNEYS: Attorney[] = [
  {
    id: '1',
    name: '최철호 변호사',
    role: '대표변호사 / Managing Partner',
    imageUrl: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specialties: ['형사전문', '민사전문', '건설/부동산'],
    education: [
      '중앙대학교 컴퓨터공학과',
      '성균관대학교 법학전문대학원'
    ],
    career: [
      '(현) 법무법인 명 대표변호사',
      '(전) 법무법인 수호 변호사',
      '(전) GS건설 사내변호사',
      '(전) 롯데건설 사내변호사',
      '(전) 서울고등법원 실무수습',
      '(전) 서울북부지방법원 실무수습'
    ]
  },
  {
    id: '2',
    name: '고재연 변호사',
    role: '파트너 변호사 / Partner',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specialties: ['기업법무', '조세/회계', '지식재산권'],
    education: [
      '서강대학교 경영학',
      '성균관대학교 법학전문석사'
    ],
    career: [
      '(현) 법무법인 명 파트너 변호사',
      '(전) 법무법인 수호 변호사',
      '(전) 삼일회계법인 회계사',
      '(전) 삼성전자 법무실 준법지원팀 변호사',
      '서울지방변호사회 조세연수원 제18기',
      '한국지식재산권변호사협회 회원'
    ]
  },
];

export const Attorneys: React.FC = () => {
  return (
    <section id="attorneys" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Our Professionals</span>
            <h2 className="text-4xl font-serif font-bold text-brand-dark mb-4">최고의 법률 전문가</h2>
            <p className="text-gray-500">법무법인 명의 전문가들은 각 분야에서의 풍부한 경험을 바탕으로 최적의 솔루션을 제공합니다.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {ATTORNEYS.map((attorney) => (
            <div key={attorney.id} className="group bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="grid md:grid-cols-2 h-full">
                {/* Image Section */}
                <div className="relative h-72 md:h-full overflow-hidden">
                  <img 
                    src={attorney.imageUrl} 
                    alt={attorney.name} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/10 transition-colors duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-1">{attorney.name}</h3>
                  <p className="text-brand-gold font-medium text-sm mb-6 uppercase tracking-wide">{attorney.role}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {attorney.specialties.map((spec, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 font-medium rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {attorney.education && (
                      <div>
                        <h4 className="text-sm font-bold text-brand-dark mb-2 border-b border-gray-100 pb-1">학력</h4>
                        <ul className="text-sm text-gray-500 space-y-1">
                          {attorney.education.map((edu, idx) => (
                            <li key={idx}>• {edu}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {attorney.career && (
                      <div>
                        <h4 className="text-sm font-bold text-brand-dark mb-2 border-b border-gray-100 pb-1">주요 경력</h4>
                        <ul className="text-sm text-gray-500 space-y-1">
                          {attorney.career.map((car, idx) => (
                            <li key={idx}>• {car}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};