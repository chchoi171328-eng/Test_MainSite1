import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';

export const metadata: Metadata = {
  title: '이용약관',
  description: '법무법인 명(SOL & LUNA) 웹사이트 이용약관입니다.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="이용약관" />
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              <strong>제1조 (목적)</strong><br />
              본 약관은 법무법인 명(이하 '본 법인')이 제공하는 웹사이트 서비스의 이용조건 및 절차, 이용자와 본 법인의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
            <p>
              <strong>제2조 (용어의 정의)</strong><br />
              '서비스'라 함은 본 법인이 웹사이트를 통해 이용자에게 제공하는 모든 온라인 정보를 의미합니다.
            </p>
            <p>
              <strong>제3조 (저작권의 귀속 및 이용제한)</strong><br />
              본 법인이 작성한 저작물에 대한 저작권 및 기타 지적재산권은 본 법인에 귀속합니다. 이용자는 서비스를 이용함으로써 얻은 정보를 본 법인의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
            </p>
            <p>
              <strong>제4조 (면책조항)</strong><br />
              본 법인은 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
