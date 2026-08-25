import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * 홈 "어떤 상황이신가요?" 섹션 (라우팅 지침 작업 1, 방식 A)
 * - 홈 전용: 히어로 바로 아래, 철학 섹션 위. 다른 페이지에 렌더링하지 않는다.
 * - 상황문 카피·순서·링크는 FIELD_MASTER_PLAN §1-4 고정 — 행 추가·순서 변경·문구 수정 금지.
 *   (예외: 플랜트 행은 PLANT_PAGE_BRIEF 작업 3에 따라 건설 항목 다음에 추가 — 2026-08)
 */
const SITUATIONS: { text: string; field: string | null; href: string }[] = [
  { text: '경찰 조사를 앞두고 있거나, 가족이 조사를 받고 있습니다', field: '형사', href: '/practice/criminal' },
  { text: '사기·폭행 등 범죄 피해를 입어 고소를 생각하고 있습니다', field: '형사 피해자', href: '/practice/criminal-victim' },
  { text: '빌려준 돈, 받을 돈을 받지 못하고 있습니다', field: '민사', href: '/practice/civil' },
  { text: '법원에서 소장이나 지급명령서를 받았습니다', field: '민사', href: '/practice/civil#sued' },
  { text: '이혼을 생각 중이거나, 배우자가 이혼을 요구합니다', field: '이혼', href: '/practice/divorce' },
  { text: '상속 분쟁이 있거나, 돌아가신 분의 빚이 걱정됩니다', field: '상속', href: '/practice/inheritance' },
  { text: '임대차·매매·토지 등 부동산 문제가 있습니다', field: '부동산', href: '/practice/real-estate' },
  { text: '공사대금·하도급대금 분쟁이 있습니다', field: '건설', href: '/practice/construction' },
  { text: '플랜트 공사에서 공사대금이나 공기지연, 성능보증 문제로 다투고 있습니다', field: '건설·플랜트', href: '/practice/construction/plant' },
];

export const SituationRouting: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <p className="font-serif text-xs md:text-sm tracking-[0.25em] uppercase text-brand-gold mb-2 md:mb-3">
          How Can We Help
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-3 break-keep">
          어떤 상황이신가요?
        </h2>
        <p className="text-gray-500 mb-8 break-keep">지금 상황과 가장 가까운 문장을 선택하세요.</p>

        <nav aria-label="상황으로 찾기">
          <ul className="max-w-3xl">
            {SITUATIONS.map((s) => (
              <li key={s.text} className="border-b border-gray-100">
                <Link
                  href={s.href}
                  className="flex items-center justify-between gap-4 py-4 min-h-[44px] px-2 -mx-2 hover:bg-brand-light/60 transition-colors group"
                >
                  <span className="text-[15px] font-medium text-brand-dark break-keep">{s.text}</span>
                  <span className="flex items-center gap-3 shrink-0">
                    {s.field && (
                      <span className="hidden md:inline text-xs text-gray-400">{s.field}</span>
                    )}
                    <ArrowRight size={16} className="text-brand-gold group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </li>
            ))}
            {/* 9행 — 시각적 구분 필수 (일반 행과 같은 스타일 금지) */}
            <li>
              <Link
                href="/consultation"
                className="flex items-center justify-between gap-4 py-4 min-h-[44px] px-4 mt-3 bg-brand-gold/10 rounded-sm hover:bg-brand-gold/20 transition-colors group"
              >
                <span>
                  <span className="block text-[15px] font-bold text-brand-dark break-keep">
                    어떤 문제인지 잘 모르겠습니다
                  </span>
                  <span className="block mt-1 text-[13px] text-[#8a6f4d] font-light break-keep">
                    분류하지 않으셔도 됩니다. 먼저 편하게 물어보세요.
                  </span>
                </span>
                <ArrowRight size={16} className="text-brand-gold shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};
