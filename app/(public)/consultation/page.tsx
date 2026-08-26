import type { Metadata } from 'next';
import { PageHeader } from '../../../components/PageHeader';
import { Consultation } from '../../../components/Consultation';

export const metadata: Metadata = {
  title: '온라인 상담 신청',
  description:
    '법무법인 명 온라인 상담 신청. 사소한 질문이라도 괜찮습니다. 상담 후 의뢰하지 않으셔도 됩니다. 대표변호사 법률상담은 60분 기준 150,000원(VAT 포함), 30분 이내에 끝나면 100,000원만 받습니다.',
  alternates: { canonical: '/consultation' },
};

export default function ConsultationPage() {
  return (
    <>
      {/* consult-chairs 이미지는 헤더 배경으로만 사용 (본문 중복 제거, 지침) */}
      <PageHeader
        label="Consultation"
        title="온라인 상담 신청"
        subtitle="사소한 질문이라도 괜찮습니다."
        imageSrc="/assets/brand/consult-chairs.webp"
        imageAlt="법무법인 명 상담실의 좌석"
      />
      <Consultation />
    </>
  );
}
