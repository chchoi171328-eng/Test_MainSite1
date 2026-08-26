import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { Fees } from '../../../components/Fees';

export const metadata: Metadata = {
  title: '수임료 안내',
  description:
    '법무법인 명의 수임료 안내. 사건 영역별 착수금 범위와 상담료를 처음부터 안내합니다. 대표변호사 법률상담은 60분 기준 150,000원(VAT 포함), 30분 이내에 끝나면 100,000원만 받습니다.',
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
