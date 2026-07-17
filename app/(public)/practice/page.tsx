import type { Metadata } from 'next';
import { PracticeAreas } from '../../../components/PracticeAreas';

export const metadata: Metadata = {
  title: '업무 분야',
  description:
    '법무법인 명의 업무 분야. 형사 변호, 민사 소송, 가사(이혼·상속)를 주력으로 부동산·건설, 기업 법무 사건을 다룹니다.',
  alternates: { canonical: '/practice' },
};

export default function PracticePage() {
  return (
    <div className="pt-20">
      <PracticeAreas />
    </div>
  );
}
