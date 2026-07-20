import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { Fees } from '../../../components/Fees';

export const metadata: Metadata = {
  title: '수임료 안내',
  description:
    '법무법인 명의 수임료 안내. 사건 영역별 착수금 범위와 상담료를 처음부터 안내합니다. 상담료는 30분 100,000원(VAT 포함)이며, 사건을 수행할 변호사가 직접 예약제로 진행합니다.',
  alternates: { canonical: '/fees' },
};

export default function FeesPage() {
  return (
    <>
      <PageHeader label="Legal Fees" title="수임료 안내" />
      <Fees />
    </>
  );
}
