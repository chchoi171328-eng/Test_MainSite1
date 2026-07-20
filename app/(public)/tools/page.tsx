import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { SmartTools } from '../../../components/SmartTools';

export const metadata: Metadata = {
  title: '스마트 도구',
  description: '관할법원 찾기, 이자 계산기, 증거 수집 가이드 등 법률 문제 해결을 돕는 셀프 서비스 도구입니다.',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        label="Smart Legal Tools"
        title="스마트 도구"
        subtitle="직접 확인해보실 수 있도록 만들었습니다."
      />
      <SmartTools />
    </>
  );
}
