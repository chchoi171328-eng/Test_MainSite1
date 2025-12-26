import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Logo } from './Logo';
import { useNavigation, PageType } from '../contexts/NavigationContext';

interface NavItemConfig {
  label: string;
  page?: PageType;
  children?: NavItemConfig[];
}

const NAV_ITEMS: NavItemConfig[] = [
  { label: '법인 소개', page: 'about' },
  { label: '업무 분야', page: 'practice' },
  { label: '성공사례', page: 'success' },
  { 
    label: '법률정보', 
    children: [
      { label: '최신 법률 정보', page: 'legal' },
      { label: '법률 서식', page: 'legal-forms' },
      { label: '주요 판례', page: 'legal-cases' }
    ]
  },
  { label: '스마트 도구', page: 'tools' },
  { label: '오시는 길', page: 'contact' },
];

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { currentPage, navigateTo } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = currentPage === 'home';
  const isTransparent = isHome && !isScrolled;

  const navClasses = `fixed w-full z-50 transition-all duration-300 ${
    isTransparent 
      ? 'bg-transparent py-6' 
      : 'bg-white/95 backdrop-blur-md shadow-md py-3'
  }`;

  const textClass = isTransparent ? 'text-gray-200 hover:text-white' : 'text-brand-dark hover:text-brand-gold';
  const logoTextClass = isTransparent ? 'text-white' : 'text-brand-dark';

  // Helper to check if item or its children is active
  const isItemActive = (item: NavItemConfig) => {
    if (item.page === currentPage) return true;
    if (item.children) {
      return item.children.some(child => child.page === currentPage);
    }
    return false;
  };

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center relative">
        <button onClick={() => navigateTo('home')} className="z-50 text-left relative">
          <Logo className="h-10 w-10 md:h-12 md:w-12" textClassName={logoTextClass} />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <div 
              key={item.label} 
              className="relative group"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => item.children && setActiveDropdown(null)}
            >
              <button
                onClick={() => {
                  if (item.page) navigateTo(item.page);
                }}
                className={`text-sm font-medium tracking-wider transition-colors flex items-center gap-1 py-2 ${
                  isItemActive(item) && !isTransparent ? 'text-brand-gold' : textClass
                }`}
              >
                {item.label}
                {item.children && <ChevronDown size={14} className={activeDropdown === item.label ? 'rotate-180 transition-transform' : 'transition-transform'} />}
              </button>

              {/* Desktop Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 w-48 animate-fade-in">
                  <div className="bg-white shadow-lg rounded-sm py-2 border-t-2 border-brand-gold">
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        onClick={() => {
                          if (child.page) navigateTo(child.page);
                          setActiveDropdown(null);
                        }}
                        className={`block w-full text-left px-4 py-3 text-sm hover:bg-brand-light transition-colors ${
                          currentPage === child.page ? 'text-brand-gold font-bold' : 'text-gray-600'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => navigateTo('consultation')}
            className="px-6 py-2 bg-brand-gold text-white text-sm font-bold tracking-wide rounded-sm hover:bg-yellow-700 transition-colors duration-300"
          >
            상담 예약
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden z-50 relative ${isTransparent && !isMobileMenuOpen ? 'text-white' : 'text-brand-dark'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                        className={`text-2xl font-serif hover:text-brand-gold flex items-center justify-center gap-2 mx-auto ${
                           isItemActive(item) ? 'text-brand-gold font-bold' : 'text-brand-dark'
                        }`}
                      >
                        {item.label}
                        {mobileExpanded === item.label ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      
                      {mobileExpanded === item.label && (
                        <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-sm animate-fade-in">
                          {item.children.map((child) => (
                             <button
                                key={child.label}
                                onClick={() => {
                                  if (child.page) navigateTo(child.page);
                                  setIsMobileMenuOpen(false);
                                }}
                                className={`block w-full text-lg ${
                                  currentPage === child.page ? 'text-brand-gold font-bold' : 'text-gray-600'
                                }`}
                              >
                                {child.label}
                              </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        if (item.page) navigateTo(item.page);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-2xl font-serif hover:text-brand-gold ${
                        currentPage === item.page ? 'text-brand-gold font-bold' : 'text-brand-dark'
                      }`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  navigateTo('consultation');
                  setIsMobileMenuOpen(false);
                }}
                className="text-2xl font-serif text-brand-gold font-bold hover:text-yellow-700 mt-4"
              >
                상담 예약
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};