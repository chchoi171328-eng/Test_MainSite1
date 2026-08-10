'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Logo } from './Logo';
import { trackEvent } from '../lib/analytics';

interface NavLink {
  label: string;
  href: string;
}

/** 2단 메가 패널 — 분야 그리드 + (선택) 측면 열 + 하단 풀폭 행 */
interface MegaPanel {
  /** 분야 그리드 위 섹션 라벨 */
  fieldsLabel: string;
  /** 2열 그리드 항목. DOM 순서는 FIELD_ORDER의 교차 순서를 그대로 쓴다 */
  fields: NavLink[];
  /** 오른쪽 별도 열 (없으면 그리드만) */
  side?: { label: string; items: NavLink[] };
  /** 하단 풀폭 행 */
  all: NavLink;
  /** 패널 폭(px) */
  width: number;
}

interface NavItemConfig {
  label: string;
  href?: string;
  externalUrl?: string;
  /** 단순 목록형 드롭다운 (항목 수가 적은 메뉴) */
  children?: NavLink[];
  /** 메가 패널형 드롭다운 */
  mega?: MegaPanel;
}

/**
 * 분야 8종 — 업무 분야 카드 순서.
 *
 * 메가 패널과 모바일 칩 그리드는 CSS grid 2열이고 grid는 **행 우선**으로 채우므로,
 * 세로로 읽었을 때 카드 순서가 되도록 DOM 순서를 1열/2열 교차로 배열한다.
 *   1열 형사 변호 → 형사 피해자·고소 → 민사 소송 → 이혼
 *   2열 상속 → 부동산 → 건설·공사대금 → 기업 법무
 */
const FIELD_ORDER: { key: string; label: string }[] = [
  { key: 'criminal', label: '형사 변호' },
  { key: 'inheritance', label: '상속' },
  { key: 'criminal-victim', label: '형사 피해자·고소' },
  { key: 'real-estate', label: '부동산' },
  { key: 'civil', label: '민사 소송' },
  { key: 'construction', label: '건설·공사대금' },
  { key: 'divorce', label: '이혼' },
  { key: 'corporate', label: '기업 법무' },
];

const fieldLinks = (base: string): NavLink[] =>
  FIELD_ORDER.map((f) => ({ label: f.label, href: `${base}/${f.key}` }));

const NAV_ITEMS: NavItemConfig[] = [
  {
    label: '법인 소개',
    children: [
      { label: '법인 소개', href: '/about' },
      { label: '최철호 변호사', href: '/attorneys/choi-cheolho' }
    ]
  },
  {
    // 라벨 클릭 시 /practice 이동 유지 + 세부 페이지 8종 메가 패널
    label: '업무 분야',
    href: '/practice',
    mega: {
      fieldsLabel: '업무 분야',
      fields: fieldLinks('/practice'),
      all: { label: '업무 분야 전체 보기', href: '/practice' },
      width: 440,
    },
  },
  { label: '수임료 안내', href: '/fees' },
  { label: '성공사례', href: '/cases' },
  {
    // 라벨 클릭 시 /legal-info 이동 + 분야별 가이드 8종 + 소식·자료 열
    label: '법률정보',
    href: '/legal-info',
    mega: {
      fieldsLabel: '분야별 가이드',
      fields: fieldLinks('/guides'),
      side: {
        label: '소식 · 자료',
        items: [
          { label: '소식', href: '/news' },
          { label: '법률 서식', href: '/legal-forms' },
          { label: '주요 판례', href: '/legal-cases' },
        ],
      },
      all: { label: '법률정보 전체 보기', href: '/legal-info' },
      width: 600,
    },
  },
  { label: '스마트 도구', href: '/tools' },
  { label: '오시는 길', href: '/contact' },
  { label: 'EN', externalUrl: 'https://www.lsfp.co.kr/' },
];

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 페이지 이동 시 모바일 메뉴·드롭다운 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileExpanded(null);
    setActiveDropdown(null);
  }, [pathname]);

  // 드롭다운 닫힘 — ESC / 패널 밖 클릭 (지시서 §3)
  useEffect(() => {
    if (!activeDropdown) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [activeDropdown]);

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled;

  const navClasses = `fixed w-full z-50 transition-all duration-300 ${isTransparent
      ? 'bg-transparent py-6'
      : 'bg-white/95 backdrop-blur-md shadow-md py-3'
    }`;

  const textClass = isTransparent ? 'text-gray-200 hover:text-white' : 'text-brand-dark hover:text-brand-gold';
  const logoTextClass = isTransparent ? 'text-white' : 'text-brand-dark';

  // 하위 링크 전체 (단순 목록 + 메가 패널) — 활성 판정용
  const childLinks = (item: NavItemConfig): NavLink[] => [
    ...(item.children ?? []),
    ...(item.mega ? [...item.mega.fields, ...(item.mega.side?.items ?? [])] : []),
  ];

  const hasDropdown = (item: NavItemConfig) => Boolean(item.children || item.mega);

  // Helper to check if item or its children is active
  const isItemActive = (item: NavItemConfig) => {
    if (item.href && pathname.startsWith(item.href)) return true;
    return childLinks(item).some((child) => pathname.startsWith(child.href));
  };

  /** 드롭다운 내부 링크 공통 클래스 — 활성 시 골드 */
  const panelLinkClass = (href: string, base: string) =>
    `${base} ${pathname.startsWith(href) ? 'text-brand-gold font-medium' : ''}`;

  return (
    <nav className={navClasses} ref={navRef}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center relative">
        <Link href="/" className="z-50 text-left relative">
          <Logo className="h-10 w-10 md:h-12 md:w-12" textClassName={logoTextClass} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => hasDropdown(item) && setActiveDropdown(item.label)}
              onMouseLeave={() => hasDropdown(item) && setActiveDropdown(null)}
              onFocus={() => hasDropdown(item) && setActiveDropdown(item.label)}
              onBlur={(e) => {
                // 포커스가 드롭다운 밖으로 나가면 닫기 (키보드 접근성)
                if (hasDropdown(item) && !e.currentTarget.contains(e.relatedTarget as Node)) {
                  setActiveDropdown(null);
                }
              }}
            >
              {item.externalUrl ? (
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('english_site_click', { location: 'nav_desktop' })}
                  className={`text-sm font-medium tracking-wider transition-colors flex items-center gap-1 py-2 ${textClass}`}
                >
                  {item.label}
                </a>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className={`text-sm font-medium tracking-wider transition-colors flex items-center gap-1 py-2 ${isItemActive(item) && !isTransparent ? 'text-brand-gold' : textClass
                    }`}
                >
                  {item.label}
                  {hasDropdown(item) && (
                    <ChevronDown
                      size={14}
                      className={activeDropdown === item.label ? 'rotate-180 transition-transform' : 'transition-transform'}
                    />
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                  aria-expanded={activeDropdown === item.label}
                  aria-haspopup="true"
                  className={`text-sm font-medium tracking-wider transition-colors flex items-center gap-1 py-2 ${isItemActive(item) && !isTransparent ? 'text-brand-gold' : textClass
                    }`}
                >
                  {item.label}
                  {hasDropdown(item) && <ChevronDown size={14} className={activeDropdown === item.label ? 'rotate-180 transition-transform' : 'transition-transform'} />}
                </button>
              )}

              {/* Desktop Dropdown — 단순 목록형 */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 w-48 animate-fade-in">
                  <div className="bg-white rounded-sm py-2 border-t-2 border-brand-dark shadow-[0_18px_50px_rgba(20,25,35,0.18)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setActiveDropdown(null)}
                        className={panelLinkClass(
                          child.href,
                          'block w-full text-left px-4 py-[9px] text-sm text-[#333] hover:bg-[#f7f5f1] hover:text-brand-dark transition-colors'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Desktop Dropdown — 메가 패널 (지시서 §1·§2) */}
              {item.mega && activeDropdown === item.label && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 animate-fade-in"
                  style={{ width: item.mega.width }}
                >
                  <div className="bg-white border-t-2 border-brand-dark shadow-[0_18px_50px_rgba(20,25,35,0.18)]">
                    <div
                      className={`grid ${item.mega.side ? 'grid-cols-[1fr_168px]' : 'grid-cols-1'}`}
                    >
                      {/* 분야 2열 그리드 — 세로로 읽으면 카드 순서 */}
                      <div className="pt-[22px] px-[26px] pb-[18px]">
                        <div className="text-[11px] tracking-[0.18em] text-brand-gold font-bold mb-3">
                          {item.mega.fieldsLabel}
                        </div>
                        <div className="grid grid-cols-2 gap-x-[26px]">
                          {item.mega.fields.map((field) => (
                            <Link
                              key={field.href}
                              href={field.href}
                              onClick={() => setActiveDropdown(null)}
                              className={panelLinkClass(
                                field.href,
                                'block px-2 py-[9px] text-[14.5px] text-[#333] rounded-sm break-keep transition-colors hover:bg-[#f7f5f1] hover:text-brand-dark'
                              )}
                            >
                              {field.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* 소식·자료 — 성격 구분을 위한 별도 열 */}
                      {item.mega.side && (
                        <div className="border-l border-[#e7e3db] bg-[#fbfaf8] pt-[22px] px-[22px] pb-[18px]">
                          <div className="text-[11px] tracking-[0.18em] text-brand-gold font-bold mb-3">
                            {item.mega.side.label}
                          </div>
                          {item.mega.side.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setActiveDropdown(null)}
                              className={panelLinkClass(
                                sub.href,
                                'block px-2 py-[9px] text-sm text-[#4a4a4a] rounded-sm break-keep transition-colors hover:bg-[#f1eee7] hover:text-brand-dark'
                              )}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* 하단 풀폭 행 */}
                      <Link
                        href={item.mega.all.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`${item.mega.side ? 'col-span-2' : ''} border-t border-[#e7e3db] px-[26px] py-[13px] flex justify-between items-center text-[13.5px] text-brand-dark bg-white hover:bg-[#f7f5f1] transition-colors`}
                      >
                        <span className="font-medium">{item.mega.all.label}</span>
                        <span className="text-brand-gold" aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link
            href="/consultation"
            onClick={() => trackEvent('booking_click', { location: 'nav_desktop' })}
            className="tracking-wide inline-flex items-center justify-center font-bold transition-all duration-300 rounded-sm bg-brand-gold text-white hover:bg-yellow-700 shadow-lg hover:shadow-xl hover:scale-105 px-4 py-2 text-sm"
          >
            상담 예약
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden z-50 relative ${isTransparent && !isMobileMenuOpen ? 'text-white' : 'text-brand-dark'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {isMobileMenuOpen ? <X size={28} className="text-brand-dark" /> : <Menu size={28} />}
        </button>

        {/*
          Mobile Menu Overlay

          스크롤 컨테이너에 justify-center를 쓰지 않는다. 내용이 뷰포트보다 길어지면
          (아코디언 펼침) justify-content:center는 위아래로 함께 넘쳐 위쪽 항목에
          스크롤로 닿을 수 없게 된다. 대신 내부 블록에 my-auto를 준다 — 여백이 있으면
          중앙 정렬되고, 여백이 음수면 auto 마진이 0으로 접혀 위에서부터 스크롤된다.
          pt-24는 고정된 로고·닫기 버튼(z-50) 아래로 첫 항목이 들어가지 않게 하는 여백.
        */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col items-center w-full h-screen overflow-y-auto overscroll-contain">
            <div className="flex flex-col items-center space-y-6 w-full px-8 pt-24 pb-12 my-auto">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="w-full text-center">
                  {hasDropdown(item) ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        aria-expanded={mobileExpanded === item.label}
                        className={`text-2xl font-serif hover:text-brand-gold flex items-center justify-center gap-2 mx-auto ${isItemActive(item) ? 'text-brand-gold font-bold' : 'text-brand-dark'
                          }`}
                      >
                        {item.label}
                        {mobileExpanded === item.label ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>

                      {/* 모바일 아코디언 — 칩 그리드 (지시서 §4) */}
                      {mobileExpanded === item.label && (
                        <div className="mt-3 -mx-2 px-3 pt-1 pb-4 bg-[#fbfaf8] border border-[#f0ede7] rounded-sm text-left animate-fade-in">
                          {item.children && (
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={panelLinkClass(
                                    child.href,
                                    'block px-2.5 py-2.5 text-sm text-[#3a3a3a] bg-white border border-[#efece5] rounded break-keep'
                                  )}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}

                          {item.mega && (
                            <>
                              <div className="text-[10.5px] tracking-[0.16em] text-brand-gold font-bold mt-3 mb-2 pl-0.5">
                                {item.mega.fieldsLabel}
                              </div>
                              {/* 분야 8개 = 2열 칩 그리드 (데스크톱과 동일한 교차 DOM 순서) */}
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {item.mega.fields.map((field) => (
                                  <Link
                                    key={field.href}
                                    href={field.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={panelLinkClass(
                                      field.href,
                                      'block px-2.5 py-2.5 text-sm text-[#3a3a3a] bg-white border border-[#efece5] rounded break-keep'
                                    )}
                                  >
                                    {field.label}
                                  </Link>
                                ))}
                              </div>

                              {item.mega.side && (
                                <>
                                  <div className="text-[10.5px] tracking-[0.16em] text-brand-gold font-bold mt-4 mb-2 pl-0.5">
                                    {item.mega.side.label}
                                  </div>
                                  {/* 소식·법률 서식·주요 판례 = 3열 한 줄 */}
                                  <div className="grid grid-cols-3 gap-2">
                                    {item.mega.side.items.map((sub) => (
                                      <Link
                                        key={sub.href}
                                        href={sub.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={panelLinkClass(
                                          sub.href,
                                          'block px-1 py-2.5 text-[13.5px] text-center text-[#4a4a4a] bg-white border border-[#efece5] rounded break-keep'
                                        )}
                                      >
                                        {sub.label}
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              )}

                              <Link
                                href={item.mega.all.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block mt-2.5 py-[11px] text-center text-[13.5px] font-medium text-brand-dark bg-white border border-[#dcd6c8] rounded"
                              >
                                {item.mega.all.label} →
                              </Link>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  ) : item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackEvent('english_site_click', { location: 'nav_mobile' });
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-2xl font-serif hover:text-brand-gold text-brand-dark"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href || '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-2xl font-serif hover:text-brand-gold ${pathname === item.href ? 'text-brand-gold font-bold' : 'text-brand-dark'
                        }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/consultation"
                onClick={() => {
                  trackEvent('booking_click', { location: 'nav_mobile' });
                  setIsMobileMenuOpen(false);
                }}
                className="text-2xl font-serif text-brand-gold font-bold hover:text-yellow-700 mt-4"
              >
                상담 예약
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
