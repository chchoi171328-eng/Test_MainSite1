'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Logo } from './Logo';
import { trackEvent } from '../lib/analytics';

interface NavItemConfig {
  label: string;
  href?: string;
  externalUrl?: string;
  children?: NavItemConfig[];
  /** 드롭다운에서 이 항목 위에 구분선을 그린다 */
  divider?: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    label: '법인 소개',
    children: [
      { label: '법인 소개', href: '/about' },
      { label: '최철호 변호사', href: '/attorneys/choi-cheolho' }
    ]
  },
  {
    // 라벨 클릭 시 /practice 이동 유지 + 세부 페이지 8종 드롭다운 (UX 수정 4, 카드 순서 기준)
    label: '업무 분야',
    href: '/practice',
    children: [
      { label: '형사 변호', href: '/practice/criminal' },
      { label: '형사 피해자·고소', href: '/practice/criminal-victim' },
      { label: '민사 소송', href: '/practice/civil' },
      { label: '이혼', href: '/practice/divorce' },
      { label: '상속', href: '/practice/inheritance' },
      { label: '부동산', href: '/practice/real-estate' },
      { label: '건설·공사대금', href: '/practice/construction' },
      { label: '기업 법무', href: '/practice/corporate' },
      { label: '업무 분야 전체 보기', href: '/practice', divider: true },
    ],
  },
  { label: '수임료 안내', href: '/fees' },
  { label: '성공사례', href: '/cases' },
  {
    label: '법률정보',
    children: [
      { label: '최신 법률 정보', href: '/insights' },
      { label: '법률 서식', href: '/legal-forms' },
      { label: '주요 판례', href: '/legal-cases' }
    ]
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled;

  const navClasses = `fixed w-full z-50 transition-all duration-300 ${isTransparent
      ? 'bg-transparent py-6'
      : 'bg-white/95 backdrop-blur-md shadow-md py-3'
    }`;

  const textClass = isTransparent ? 'text-gray-200 hover:text-white' : 'text-brand-dark hover:text-brand-gold';
  const logoTextClass = isTransparent ? 'text-white' : 'text-brand-dark';

  // Helper to check if item or its children is active
  const isItemActive = (item: NavItemConfig) => {
    if (item.href && pathname.startsWith(item.href)) return true;
    if (item.children) {
      return item.children.some(child => child.href && pathname.startsWith(child.href));
    }
    return false;
  };

  return (
    <nav className={navClasses}>
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
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => item.children && setActiveDropdown(null)}
              onFocus={() => item.children && setActiveDropdown(item.label)}
              onBlur={(e) => {
                // 포커스가 드롭다운 밖으로 나가면 닫기 (키보드 접근성)
                if (item.children && !e.currentTarget.contains(e.relatedTarget as Node)) {
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
                  {item.children && (
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
                  {item.children && <ChevronDown size={14} className={activeDropdown === item.label ? 'rotate-180 transition-transform' : 'transition-transform'} />}
                </button>
              )}

              {/* Desktop Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 w-48 animate-fade-in">
                  <div className="bg-white shadow-lg rounded-sm py-2 border-t-2 border-brand-gold">
                    {item.children.map((child) => (
                      <React.Fragment key={child.label}>
                        {child.divider && <div className="my-2 border-t border-gray-100" aria-hidden="true" />}
                        <Link
                          href={child.href || '/'}
                          onClick={() => setActiveDropdown(null)}
                          className={`block w-full text-left px-4 py-3 text-sm hover:bg-brand-light transition-colors ${pathname === child.href ? 'text-brand-gold font-bold' : 'text-gray-600'
                            }`}
                        >
                          {child.label}
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link
            href="/consultation"
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

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 flex flex-col justify-center items-center w-full h-screen overflow-y-auto py-20">
            <div className="flex flex-col items-center space-y-6 w-full px-8">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="w-full text-center">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className={`text-2xl font-serif hover:text-brand-gold flex items-center justify-center gap-2 mx-auto ${isItemActive(item) ? 'text-brand-gold font-bold' : 'text-brand-dark'
                          }`}
                      >
                        {item.label}
                        {mobileExpanded === item.label ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>

                      {mobileExpanded === item.label && (
                        <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-sm animate-fade-in">
                          {item.children.map((child) => (
                            <React.Fragment key={child.label}>
                              {child.divider && <div className="border-t border-gray-200" aria-hidden="true" />}
                              <Link
                                href={child.href || '/'}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block w-full text-lg ${pathname === child.href ? 'text-brand-gold font-bold' : 'text-gray-600'
                                  }`}
                              >
                                {child.label}
                              </Link>
                            </React.Fragment>
                          ))}
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
                onClick={() => setIsMobileMenuOpen(false)}
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
