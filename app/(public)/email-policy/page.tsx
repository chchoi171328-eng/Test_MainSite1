import type { Metadata } from 'next';
import { MailWarning } from 'lucide-react';

export const metadata: Metadata = {
  title: '이메일무단수집거부',
  description: '법무법인 명(SOL & LUNA)의 이메일무단수집거부 안내입니다.',
  alternates: { canonical: '/email-policy' },
};

export default function EmailPolicyPage() {
  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-8 text-brand-dark">
          <MailWarning size={28} className="text-brand-gold" />
          <h1 className="text-3xl font-serif font-bold">이메일무단수집거부</h1>
        </div>
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
            게시일: 2024년 1월 1일<br />
            법무법인 명(SOL & LUNA)
          </p>
        </div>
      </div>
    </section>
  );
}
