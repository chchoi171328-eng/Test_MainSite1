import type { Metadata } from 'next';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '법무법인 명(SOL & LUNA)의 개인정보처리방침입니다.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-8 text-brand-dark">
          <Shield size={28} className="text-brand-gold" />
          <h1 className="text-3xl font-serif font-bold">개인정보처리방침</h1>
        </div>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            <strong>제1조 (개인정보의 처리 목적)</strong><br />
            법무법인 명(이하 '본 법인')은 의뢰인의 상담 문의 처리 및 법률 서비스 제공을 목적으로 필요한 최소한의 개인정보를 처리합니다.
          </p>
          <p>
            <strong>제2조 (처리하는 개인정보 항목)</strong><br />
            본 법인은 상담 신청 및 서비스 이용 과정에서 아래와 같은 개인정보를 수집할 수 있습니다.<br />
            - 필수항목: 성명, 연락처, 상담 내용<br />
            - 자동수집항목: 접속 로그, 쿠키, 접속 IP 정보
          </p>
          <p>
            <strong>제3조 (개인정보의 처리 및 보유 기간)</strong><br />
            수집된 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 법령에서 정한 일정한 기간 동안 개인정보를 보관합니다.
          </p>
          <p>
            <strong>제4조 (개인정보의 제3자 제공)</strong><br />
            본 법인은 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
          </p>
          <p>
            <strong>제5조 (개인정보보호 책임자)</strong><br />
            본 법인은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br />
            - 담당자: 경영지원팀<br />
            - 연락처: 031-658-6100
          </p>
        </div>
      </div>
    </section>
  );
}
