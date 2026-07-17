import type { Metadata } from 'next';
import { Consultation } from '../../../components/Consultation';

export const metadata: Metadata = {
  title: '온라인 상담 신청',
  description:
    '법무법인 명 온라인 상담 신청. 사소한 질문이라도 괜찮습니다. 상담 후 의뢰하지 않으셔도 됩니다. 상담료는 30분당 5만 원입니다.',
  alternates: { canonical: '/consultation' },
};

export default function ConsultationPage() {
  return (
    <div className="pt-20">
      <Consultation />
    </div>
  );
}
