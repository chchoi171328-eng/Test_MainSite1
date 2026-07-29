'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Stat } from '../types';

const STATS: Stat[] = [
  { value: "Professional", label: "전문성" },
  { value: "Risk Check", label: "선임 전 절차" },
  { value: "Honesty", label: "핵심 가치" },
];

export const About: React.FC = () => {
  // 모바일(데이터·배터리)과 reduced-motion 사용자는 영상 대신 poster 이미지만 로드
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setShowVideo(desktop.matches && !reducedMotion.matches);
    update();
    desktop.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, []);

  return (
    <section id="about" className="py-16 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Existing Philosophy Section */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-32">
          <div className="relative mb-8 md:mb-0 px-4 md:px-0">
            <div className="absolute -top-4 -left-0 md:-left-4 w-16 h-16 md:w-24 md:h-24 border-t-2 border-l-2 border-brand-gold"></div>
            <div className="relative w-full aspect-[4/3] md:aspect-[3/4] overflow-hidden shadow-2xl">
              {showVideo ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/assets/brand/hands-pen.webp"
                  preload="metadata"
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/assets/brand/hands-pen.mp4" type="video/mp4" />
                </video>
              ) : (
                <Image
                  src="/assets/brand/hands-pen.webp"
                  alt="만년필을 들고 기록을 준비하는 변호사의 손"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="absolute -bottom-4 -right-0 md:-right-4 w-16 h-16 md:w-24 md:h-24 border-b-2 border-r-2 border-brand-gold"></div>
          </div>

          <div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-dark mb-6 md:mb-8 leading-snug break-keep">
              '이겨드립니다'라는 말은 쉽습니다.<br />
              대신 책임지기는 어렵습니다.
            </h2>
            <div className="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-base md:text-lg break-keep">
              <p>
                저희 사무실은 <strong>승소 가능성보다 의뢰인의 실익을 먼저 판단</strong>합니다.
                판결을 받아도 실질적인 권리 구제가 가능한지, 소송 비용 대비 효율적인지,
                일부 승소로 끝날 위험은 없는지 철저히 계산합니다.
              </p>
              <p>
                그래서 때로는 소송을 말리고, 선임을 거절합니다.<br />
                그것이 의뢰인에게 가장 안전한 선택인 경우가 많기 때문입니다.
              </p>
              <p className="font-bold text-brand-dark">
                잘못 시작한 소송은 변호사도, 의뢰인도 되돌릴 수 없습니다.
                시작하지 말아야 할 소송을 말릴 수 있는 변호사가 장기적으로 살아남습니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-gray-100 pt-8 mt-8 md:mt-10">
              {STATS.map((stat, idx) => (
                <div key={idx} className="text-center md:text-left">
                  <p className="text-lg lg:text-2xl xl:text-3xl font-serif font-bold text-brand-gold mb-1 break-keep">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Representative Lawyer Section */}
        <div className="grid md:grid-cols-12 gap-12 items-start pt-16 border-t border-gray-100">
          {/* Image & Profile */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="relative mb-8 group">
              <Image
                src="/images/attorney-choi.jpg"
                alt="최철호 대표변호사"
                width={663}
                height={994}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full h-auto object-cover shadow-lg filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-0 left-0 bg-brand-dark text-white p-4 w-full">
                <p className="font-serif font-bold text-xl">최철호</p>
                <p className="text-xs text-brand-gold uppercase tracking-wider">Representative Attorney</p>
              </div>
            </div>

            <div className="space-y-6 text-sm text-gray-600 bg-gray-50 p-6 rounded-sm">
              <div>
                <h4 className="font-bold text-brand-dark mb-2 border-b border-gray-200 pb-2">학력</h4>
                <ul className="space-y-1 text-xs md:text-sm">
                  <li>중앙대학교 컴퓨터공학과</li>
                  <li>성균관대학교 법학전문대학원</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-brand-dark mb-2 border-b border-gray-200 pb-2">경력</h4>
                <ul className="space-y-1 text-xs md:text-sm">
                  <li>(현) 법무법인 명 대표변호사</li>
                  <li>(전) 법무법인 수호 변호사</li>
                  <li>(전) GS건설 사내변호사</li>
                  <li>(전) 롯데건설 사내변호사</li>
                  <li>(전) 서울고등법원 실무수습</li>
                  <li>(전) 서울북부지방법원 실무수습</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-200 space-y-3 text-xs md:text-sm text-gray-600 leading-relaxed break-keep">
                <p>GS건설·롯데건설 사내변호사로 일했습니다. 기업이 법을 어떻게 활용하는지 안에서 보고 왔습니다.</p>
                <p>컴퓨터공학과 법학을 함께 공부했습니다. 복잡한 사건 구조를 분해해서 보는 훈련이 되어 있습니다.</p>
                {/* TODO: 대한변호사협회 형사·민사 전문등록 표기 — 인증 번호/명칭 확인 후 삽입 */}
                {/* 전문등록 확인 후 표기 문구: "형사·민사 이중 전문 인증을 받은 법인입니다. 두 영역이 얽힌 사건도 한 곳에서 처리됩니다." */}
                {/* TODO: 평택경찰서 범죄피해자 상담 변호사 활동 표기 — 정확한 명칭 확인 후 삽입 */}
                <Link
                  href="/attorneys/choi-cheolho"
                  className="inline-block mt-2 text-brand-gold font-bold hover:text-brand-dark transition-colors"
                >
                  변호사 프로필 전체 보기 &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Greeting Text */}
          <div className="md:col-span-8 lg:col-span-8 md:pl-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-8 leading-snug break-keep">
              "의뢰인의 이익을 최우선으로,<br />
              끝까지 책임지는 변호사가 되겠습니다."
            </h2>
            <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed break-keep">
              <p>
                안녕하십니까. 법무법인 명(SOL & LUNA)의 대표변호사 최철호입니다.
              </p>
              <p>
                법무법인 명은 복잡하고 어려운 법적 분쟁 속에서 의뢰인에게 가장 명확하고 실질적인 해결책을 제시하기 위해 설립되었습니다.
                현대 사회의 법적 분쟁은 수많은 이해관계와 다양한 쟁점이 얽혀 있어, 단순한 법리 적용만으로는 해결하기 어려운 경우가 많습니다.
              </p>
              <p>
                저는 대형 건설사 사내변호사로 근무하며 현장에서 발생하는 다양한 분쟁을 직접 경험하고 해결해왔습니다.
                이러한 실무 경험을 바탕으로, 우리 법인은 소송의 승패를 넘어 의뢰인의 비즈니스와 삶에 실질적인 도움이 되는 결과를 만들어내는 것을 목표로 합니다.
              </p>
              <p>
                무리한 소송을 권유하지 않겠습니다. 듣기 좋은 말보다 뼈아픈 조언이 필요할 때 주저하지 않겠습니다.
                의뢰인의 소중한 자산과 권리를 지키기 위해, 저희 법무법인 명의 모든 구성원이 한 팀이 되어 치열하게 고민하고 싸우겠습니다.
              </p>
              <p>
                감사합니다.
              </p>
              <div className="mt-8 pt-8 text-right">
                <p className="font-serif font-bold text-brand-dark text-xl">대표변호사 최철호 올림</p>
              </div>
              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-brand-dark font-medium leading-relaxed break-keep">
                  한 사건을 끝까지 책임지기 위해, 동시에 진행하는 사건 수를 의도적으로 제한합니다.<br />
                  상담부터 변론까지 같은 변호사가 담당합니다.
                </p>
                <p className="mt-4 text-brand-dark font-medium leading-relaxed break-keep">
                  연락을 주시면 늦어도 다음 영업일에는 담당 변호사와 직접 통화하실 수 있습니다.
                </p>
                <p className="mt-4 text-brand-dark font-medium leading-relaxed break-keep">
                  법원에 제출하는 서면은 제출 전에 미리 보여드립니다. 사실관계 확인을 위해서도
                  필요한 절차입니다. 확정된 사실관계로 법리만 다투는 서면은 제출 후에 공유드리는
                  경우도 있지만, 원하시면 모든 서면을 보실 수 있습니다.
                </p>
                {/* 지역 정체성 명시 — 서울 서초 소재 동명 법인과의 구분 (지침 7단계 v2) */}
                <p className="mt-4 text-sm text-gray-500 leading-relaxed break-keep">
                  법무법인 명(SOL &amp; LUNA)은 경기도 평택시 소재 법무법인으로,
                  평택·안성·오산·아산 지역의 사건을 상담합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};