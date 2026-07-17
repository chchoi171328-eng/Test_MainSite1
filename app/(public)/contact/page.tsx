import type { Metadata } from 'next';
import { Contact } from '../../../components/Contact';

export const metadata: Metadata = {
  title: '오시는 길',
  description:
    '법무법인 명 오시는 길. 경기도 평택시 평남로 1029-1, SJ프라자 5층. 전화 031-658-6100. 평일 09:00-18:00, 주말·공휴일 예약제.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="pt-20">
      <Contact pageHeading />
    </div>
  );
}
