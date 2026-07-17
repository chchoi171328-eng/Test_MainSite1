import type { Metadata } from 'next';
import { SmartTools } from '../../../components/SmartTools';

export const metadata: Metadata = {
  title: '스마트 도구',
  description: '관할법원 찾기, 이자 계산기, 증거 수집 가이드 등 법률 문제 해결을 돕는 셀프 서비스 도구입니다.',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  return (
    <div className="pt-20">
      <SmartTools />
    </div>
  );
}
