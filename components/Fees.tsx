import React from 'react';
import Link from 'next/link';

interface FeeRow {
  area: string;
  href: string;
  range: string;
  /** 금액 아래 각주 (한정승인·기업 행) */
  footnote?: string;
  note: string;
}

// 8분야 체계 9행 — 금액은 각 세부 페이지 수임료 박스와 동일 (UX 수정 5, 원천: fees-page-preview.html)
const FEE_ROWS: FeeRow[] = [
  { area: '형사 변호', href: '/practice/criminal', range: '400~1,200만 원', note: '사건 단계와 사실관계 복잡도에 따라' },
  { area: '형사 피해자·고소', href: '/practice/criminal-victim', range: '400~1,000만 원', note: '고소 준비와 절차 대응 범위에 따라' },
  { area: '민사 소송', href: '/practice/civil', range: '300만 원부터', note: '청구금액과 입증 난이도에 따라' },
  { area: '부동산', href: '/practice/real-estate', range: '300만 원부터', note: '분쟁 유형과 다투는 금액에 따라' },
  { area: '건설·공사대금', href: '/practice/construction', range: '400만 원부터', note: '다투는 금액과 소송의 난이도에 따라' },
  { area: '이혼', href: '/practice/divorce', range: '400~700만 원', note: '재산분할·양육권 쟁점 유무에 따라' },
  { area: '상속 분쟁', href: '/practice/inheritance', range: '400만 원부터', note: '재산 규모와 쟁점에 따라' },
  {
    area: '상속포기 / 한정승인',
    href: '/practice/inheritance',
    range: '10만 원 / 100만 원 (정액)',
    footnote: '한정승인은 정리할 재산이 특별히 많은 경우, 사건 검토 시 증액된 금액을 미리 안내드립니다.',
    note: '정형화된 절차, 정액 진행',
  },
  {
    area: '기업 법무',
    href: '/practice/corporate',
    range: '자문료 시간당 25만 원',
    footnote: '착수 전에 예상 시간과 총액을 먼저 안내드립니다.',
    note: '계약서 검토·작성, 분쟁 초기 대응 등',
  },
];

export const Fees: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* 제목은 PageHeader가 담당 */}
        <div className="mb-10">
          <p className="text-2xl md:text-3xl font-serif text-brand-dark leading-relaxed break-keep">
            비용을 처음부터 알려드립니다.<br />
            진행 중에 갑자기 늘어나지 않습니다.
          </p>
        </div>

        <p className="text-gray-600 mb-12 break-keep">
          정확한 견적은 사건 검토 후 안내드립니다. 상담 시 가격이 갑자기 달라지는 일은 없습니다.
        </p>

        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-brand-dark">
                <th className="py-4 pr-4 text-sm font-bold text-brand-dark whitespace-nowrap">사건 영역</th>
                <th className="py-4 pr-4 text-sm font-bold text-brand-dark whitespace-nowrap">착수금 기준</th>
                {/* 모바일: 기준 컬럼 숨김 — 행 클릭으로 세부 확인 (fees-page-preview) */}
                <th className="hidden md:table-cell py-4 text-sm font-bold text-brand-dark">기준</th>
              </tr>
            </thead>
            <tbody>
              {FEE_ROWS.map((row) => (
                <tr key={row.area} className="border-b border-gray-200 hover:bg-brand-light/40 transition-colors">
                  <td className="py-4 pr-4 break-keep">
                    <Link
                      href={row.href}
                      className="text-brand-dark font-medium border-b border-brand-dark/25 hover:text-brand-gold hover:border-brand-gold transition-colors"
                    >
                      {row.area}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-brand-dark break-keep">
                    {row.range}
                    {row.footnote && (
                      <span className="block mt-1.5 text-xs text-[#a08b5f] font-light break-keep">
                        {row.footnote}
                      </span>
                    )}
                  </td>
                  <td className="hidden md:table-cell py-4 text-gray-600 text-sm break-keep">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 -mt-8 mb-12 break-keep">
          위 금액은 부가세 별도입니다.
        </p>

        {/* 성공보수 — fees-page-preview.html 원안 그대로 */}
        <div className="mb-12 border border-gray-200 border-t-[3px] border-t-brand-dark bg-white p-6 md:p-7">
          <p className="font-bold text-brand-dark mb-4">성공보수에 대하여</p>
          <div className="space-y-3 text-gray-600 font-light leading-relaxed break-keep">
            <p>
              착수금 외에 성공보수를 약정할 수 있습니다. 민사·부동산·건설·가사 사건은 통상{' '}
              <b className="font-medium text-brand-dark">다투는 금액의 1~10% 사이</b>에서 정해지며, 금액이
              클수록 비율은 낮아집니다. 형사사건은{' '}
              <b className="font-medium text-brand-dark">착수금 금액을 넘지 않는 범위</b>에서 정합니다.
            </p>
            <p>
              간단한 사건은 성공보수를 약정하지 않기도 하고, 사건의 성격상 통상 범위와 다르게 정해야
              하는 경우에는 계약 전에 미리 안내드립니다. 어느 경우든{' '}
              <b className="font-medium text-brand-dark">
                계약 전에 서면으로 확정하며, 진행 중에 새로 생기거나 오르지 않습니다.
              </b>
            </p>
            <p>
              무엇을 &lsquo;성공&rsquo;으로 볼지 — 판결 금액인지, 실제로 회수된 금액인지, 형사사건이라면
              어떤 결과인지 — 를 계약서에 미리 적습니다. 성공보수를 둘러싼 다툼의 대부분은 이 정의를
              미리 정하지 않아 생깁니다.
            </p>
            <p>상속포기·한정승인(정액)과 시간당 자문(기업 법무)에는 성공보수가 없습니다.</p>
          </div>
        </div>

        {/* 표준 상담료 블록 — 한/영 단일 요금 (kr-fee-unification 지침) */}
        <div className="mb-4 border border-gray-200 bg-gray-50 p-5 rounded-sm text-gray-600 space-y-1 break-keep">
          <p className="font-bold text-brand-dark">상담 안내 — 30분, 100,000원 (VAT 포함)</p>
          <p>한국어·영어 상담 동일 요금입니다.</p>
          <p>모든 상담은 사건을 수행할 변호사가 직접 진행합니다.</p>
          <p>예약제로 운영됩니다.</p>
          <p className="text-sm text-gray-500 pt-1">동일한 요금이 영문 사이트(SOL &amp; LUNA)에도 게시되어 있습니다.</p>
        </div>
        <p className="text-gray-600 mb-12 break-keep">
          사건 기록 검토와 자료 분석은 별도 안내 후 진행합니다.
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
