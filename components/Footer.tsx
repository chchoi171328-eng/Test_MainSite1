import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useNavigation } from '../contexts/NavigationContext';
import { X, Shield, FileText, MailWarning, AlertCircle, Lock } from 'lucide-react';

type LegalType = 'privacy' | 'terms' | 'email' | 'disclaimer' | null;

interface LegalContent {
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export const Footer: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeLegal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeLegal]);

  const LEGAL_CONTENTS: Record<string, LegalContent> = {
    privacy: {
      title: "개인정보처리방침",
      icon: Shield,
      content: (
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            <strong>제1조 (개인정보의 처리 목적)</strong><br/>
            법무법인 명(이하 '본 법인')은 의뢰인의 상담 문의 처리 및 법률 서비스 제공을 목적으로 필요한 최소한의 개인정보를 처리합니다.
          </p>
          <p>
            <strong>제2조 (처리하는 개인정보 항목)</strong><br/>
            본 법인은 상담 신청 및 서비스 이용 과정에서 아래와 같은 개인정보를 수집할 수 있습니다.<br/>
            - 필수항목: 성명, 연락처, 상담 내용<br/>
            - 자동수집항목: 접속 로그, 쿠키, 접속 IP 정보
          </p>
          <p>
            <strong>제3조 (개인정보의 처리 및 보유 기간)</strong><br/>
            수집된 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 법령에서 정한 일정한 기간 동안 개인정보를 보관합니다.
          </p>
          <p>
            <strong>제4조 (개인정보의 제3자 제공)</strong><br/>
            본 법인은 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
          </p>
          <p>
            <strong>제5조 (개인정보보호 책임자)</strong><br/>
            본 법인은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br/>
            - 담당자: 경영지원팀<br/>
            - 연락처: 031-658-6100
          </p>
        </div>
      )
    },
    terms: {
      title: "이용약관",
      icon: FileText,
      content: (
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            <strong>제1조 (목적)</strong><br/>
            본 약관은 법무법인 명(이하 '본 법인')이 제공하는 웹사이트 서비스의 이용조건 및 절차, 이용자와 본 법인의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
          <p>
            <strong>제2조 (용어의 정의)</strong><br/>
            '서비스'라 함은 본 법인이 웹사이트를 통해 이용자에게 제공하는 모든 온라인 정보를 의미합니다.
          </p>
          <p>
            <strong>제3조 (저작권의 귀속 및 이용제한)</strong><br/>
            본 법인이 작성한 저작물에 대한 저작권 및 기타 지적재산권은 본 법인에 귀속합니다. 이용자는 서비스를 이용함으로써 얻은 정보를 본 법인의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
          </p>
          <p>
            <strong>제4조 (면책조항)</strong><br/>
            본 법인은 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
          </p>
        </div>
      )
    },
    email: {
      title: "이메일무단수집거부",
      icon: MailWarning,
      content: (
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <div className="bg-red-50 p-4 border-l-4 border-red-500 rounded-r-sm">
            <p className="font-bold text-red-800">
              본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부합니다.
            </p>
          </div>
          <p>
            이를 위반 시 <strong>정보통신망 이용촉진 및 정보보호 등에 관한 법률</strong> 등에 의해 형사처벌 될 수 있음을 유념하시기 바랍니다.
          </p>
          <p className="text-right text-xs text-gray-500 mt-8">
            게시일: 2024년 1월 1일<br/>
            법무법인 명(SOL & LUNA)
          </p>
        </div>
      )
    },
    disclaimer: {
      title: "면책공고",
      icon: AlertCircle,
      content: (
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
           <p>
             법무법인 명 웹사이트(이하 '본 사이트')에 게재된 모든 내용은 일반적인 정보 제공을 목적으로 작성된 것이며, <strong>구체적인 사안에 대한 법률적 자문이나 해석을 의미하지 않습니다.</strong>
           </p>
           <p>
             본 사이트의 방문자는 본 사이트에서 제공하는 정보에 기초하여 어떠한 조치를 취하시기에 앞서, 반드시 본 법인의 변호사로부터 실질적인 법률 자문을 구하시기 바랍니다. 
           </p>
           <p>
             본 사이트의 정보에 의존하여 발생한 어떠한 결과에 대해서도 법무법인 명은 법적 책임을 지지 않음을 알려드립니다. 본 사이트의 내용은 예고 없이 변경될 수 있습니다.
           </p>
        </div>
      )
    }
  };

  const openLegal = (type: LegalType) => setActiveLegal(type);
  const closeLegal = () => setActiveLegal(null);

  return (
    <>
      <footer className="bg-[#111] text-gray-400 py-16 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6 cursor-pointer" onClick={() => navigateTo('home')}>
                 <Logo className="h-10 w-10 text-white" textClassName="text-white" />
              </div>
              <p className="text-sm leading-relaxed max-w-sm mb-6">
                법무법인 명(SOL & LUNA)은 고객의 성공이 곧 우리의 성공이라는 신념으로 
                최고의 법률 서비스를 제공합니다.
              </p>
              <div className="text-xs text-gray-500 space-y-2 font-light">
                 <p>경기도 평택시 평남로 1029-1, SJ프라자 5층</p>
                 <p>Tel: 031-658-6100</p>
                 <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span>사업자등록번호: 238-85-00581</span>
                    <span className="hidden sm:inline">|</span>
                    <span>광고책임변호사: 최철호</span>
                 </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigateTo('about')} className="hover:text-brand-gold transition-colors text-left">법인 소개</button></li>
                <li><button onClick={() => navigateTo('practice')} className="hover:text-brand-gold transition-colors text-left">업무 분야</button></li>
                <li><button onClick={() => navigateTo('tools')} className="hover:text-brand-gold transition-colors text-left">스마트 도구</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-brand-gold transition-colors text-left">오시는 길</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => openLegal('privacy')} className="hover:text-brand-gold transition-colors text-left">개인정보처리방침</button></li>
                <li><button onClick={() => openLegal('terms')} className="hover:text-brand-gold transition-colors text-left">이용약관</button></li>
                <li><button onClick={() => openLegal('email')} className="hover:text-brand-gold transition-colors text-left">이메일무단수집거부</button></li>
                <li><button onClick={() => openLegal('disclaimer')} className="hover:text-brand-gold transition-colors text-left">면책공고</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; {new Date().getFullYear()} SOL & LUNA Law Firm. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
               <p>Design by AI • Developed with React</p>
               <button onClick={() => navigateTo('admin')} className="text-gray-700 hover:text-gray-500 transition-colors" aria-label="Admin Access">
                 <Lock size={14} />
               </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal Overlay */}
      {activeLegal && LEGAL_CONTENTS[activeLegal] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeLegal}></div>
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 text-brand-dark">
                {React.createElement(LEGAL_CONTENTS[activeLegal].icon, { size: 24, className: "text-brand-gold" })}
                <h3 className="text-xl font-serif font-bold">{LEGAL_CONTENTS[activeLegal].title}</h3>
              </div>
              <button 
                onClick={closeLegal}
                className="text-gray-400 hover:text-brand-dark transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {LEGAL_CONTENTS[activeLegal].content}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={closeLegal}
                className="px-6 py-2 bg-brand-dark text-white text-sm font-bold rounded-sm hover:bg-gray-800 transition-colors"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};