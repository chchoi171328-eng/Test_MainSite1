import React from 'react';

interface FeeRow {
  area: string;
  range: string;
  note: string;
}

// TODO: 실제 수임 기준으로 확정 필요
const FEE_ROWS: FeeRow[] = [
  { area: '형사', range: '400~1,000만원', note: '사건 단계와 사실관계 복잡도에 따라' },
  { area: '이혼·가사', range: '400~700만원', note: '재산분할·양육권 쟁점 유무에 따라' },
  { area: '민사 (대여금·계약 분쟁)', range: '300만원 이상', note: '청구금액과 입증 난이도에 따라' },
  { area: '부동산·임대차', range: '300~600만원', note: '분쟁 유형에 따라' },
];

export const Fees: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-brand-dark mb-4">수임료 안내</h1>
          <div className="w-16 h-1 bg-brand-gold"></div>
        </div>

        <div className="mb-10">
          <p className="text-2xl md:text-3xl font-serif text-brand-dark leading-relaxed break-keep">
            비용을 처음부터 알려드립니다.<br />
            진행 중에 갑자기 늘어나지 않습니다.
          </p>
        </div>

        <p className="text-gray-600 mb-12 break-keep">
          정확한 견적은 사건 검토 후 안내드립니다. 상담 시 가격이 갑자기 달라지는 일은 없습니다.
        </p>

        {/* TODO: 실제 수임 기준으로 확정 필요 */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-brand-dark">
                <th className="py-4 pr-4 text-sm font-bold text-brand-dark whitespace-nowrap">사건 영역</th>
                <th className="py-4 pr-4 text-sm font-bold text-brand-dark whitespace-nowrap">착수금 범위</th>
                <th className="py-4 text-sm font-bold text-brand-dark">비고</th>
              </tr>
            </thead>
            <tbody>
              {FEE_ROWS.map((row) => (
                <tr key={row.area} className="border-b border-gray-200">
                  <td className="py-4 pr-4 text-brand-dark font-medium break-keep">{row.area}</td>
                  <td className="py-4 pr-4 text-brand-dark whitespace-nowrap">{row.range}</td>
                  <td className="py-4 text-gray-600 break-keep">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 -mt-8 mb-12 break-keep">
          위 금액은 부가세 별도입니다.
        </p>

        <p className="text-gray-600 mb-12 break-keep">
          상담료는 30분당 5만 원입니다. 사건 기록 검토와 자료 분석은 별도 안내 후 진행합니다.
        </p>

        <p className="text-lg text-brand-dark font-medium mb-6 break-keep">
          상담 후 승산이 낮다고 판단되면 수임을 권하지 않습니다.
        </p>

        <p className="text-sm text-gray-500 break-keep">
          수임 후 추가 비용이 발생하는 경우와 발생하지 않는 경우를 계약 전에 미리 안내드립니다.
        </p>
      </div>
    </section>
  );
};
