import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';

export const metadata: Metadata = {
  title: '면책공고',
  description: '법무법인 명(SOL & LUNA) 웹사이트 면책공고입니다.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHeader title="면책공고" />
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
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
        </div>
      </section>
    </>
  );
}
