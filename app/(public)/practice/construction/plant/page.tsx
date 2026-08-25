import type { Metadata } from 'next';
import {
  PracticeHeader,
  PSection,
  PBody,
  SituationList,
  FaqAccordion,
  FeeBox,
  FeeText,
  MoreLink,
  PracticeCta,
} from '../../../../../components/practice/PracticeShared';
import { PracticeResources } from '../../../../../components/practice/PracticeResources';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: '플랜트 공사 분쟁 변호사 | 공기지연(EOT)·성능보증(PG) | 법무법인 명' },
  description:
    '플랜트 공사 분쟁을 다룹니다. 해외 플랜트 현장 근무와 사우디·쿠웨이트 화공 플랜트 분쟁 관리 경험 — 공기지연(EOT), 성능보증(PG), 기자재 대금, 영문 공사계약 검토까지.',
  openGraph: {
    url: './',
    title: '플랜트 공사 분쟁 변호사 | 공기지연(EOT)·성능보증(PG) | 법무법인 명',
    description:
      '플랜트 공사 분쟁을 다룹니다. 해외 플랜트 현장 근무와 사우디·쿠웨이트 화공 플랜트 분쟁 관리 경험 — 공기지연(EOT), 성능보증(PG), 기자재 대금, 영문 공사계약 검토까지.',
  },
  alternates: { canonical: '/practice/construction/plant' },
};

export default function PlantPage() {
  return (
    <>
      {/* §1 헤드라인 — 카피 정본 (PLANT_PAGE_BRIEF) */}
      <PracticeHeader
        crumb={
          <>
            건설·공사대금 <b className="text-brand-gold font-medium">›</b> 플랜트
          </>
        }
        title="플랜트 공사 분쟁 — 현장에 있어본 변호사가 다룹니다."
        sub="공기지연과 성능보증. 플랜트 분쟁의 언어를 실무로 아는 변호사는 많지 않습니다."
      />

      {/* §2 이력 서사 — 카피 정본, 이대로 (기간·소속사명·특정 현장 미기재) */}
      <PSection>
        <PBody>
          변호사가 되기 전, 엔지니어링 회사에서 해외영업을 담당하며 해외 플랜트 현장에서
          근무했습니다. 건설회사 사내변호사 시절에는 사우디아라비아와 쿠웨이트의 화공 플랜트 현장에
          수개월씩 파견되어 분쟁 관리를 맡았습니다 — 주로 공기지연(EOT)과 성능보증(PG)을 둘러싼
          다툼이었습니다.
        </PBody>
        <PBody>
          플랜트 공사는 일반 건축과 계약 구조부터 다릅니다. 설계·구매·시공이 한 계약에 묶이고(EPC),
          공기와 성능이 금액으로 환산되어 있으며, 분쟁은 준공 후가 아니라 공사 중에 시작됩니다. 이
          구조를 서면으로 배운 것이 아니라 현장과 계약서 양쪽에서 다뤄봤다는 것 — 그것이 이 분야에서
          저희가 드릴 수 있는 것입니다.
        </PBody>
      </PSection>

      {/* §3 다루는 분쟁 */}
      <PSection title="다루는 분쟁" lead="플랜트·설비 공사에서 반복되는 다툼들입니다.">
        <SituationList
          items={[
            {
              text: (
                <>
                  <b className="font-medium text-brand-dark">공기지연·지체상금(LD)</b> — 공기연장(EOT)
                  사유 정리와 클레임 대응
                </>
              ),
            },
            {
              text: (
                <>
                  <b className="font-medium text-brand-dark">성능보증(PG)·성능미달</b> — 성능시험
                  결과를 둘러싼 다툼
                </>
              ),
            },
            {
              text: (
                <>
                  <b className="font-medium text-brand-dark">설계변경·추가공사</b> — 지시·시공 기록
                  기반 대금 청구
                </>
              ),
            },
            {
              text: (
                <>
                  <b className="font-medium text-brand-dark">기자재·설비 납품대금</b> — 제작·납품·설치가
                  얽힌 대금 분쟁
                </>
              ),
            },
            {
              text: (
                <>
                  <b className="font-medium text-brand-dark">하도급대금</b> — 원청 도산·지급 지체 시
                  직접청구
                </>
              ),
            },
            {
              text: (
                <>
                  <b className="font-medium text-brand-dark">영문 공사계약 검토·자문</b> — 해외
                  발주처·원청과의 계약. 해외 계약은 계약서 검토와 클레임 대응 자문까지 합니다.
                </>
              ),
            },
          ]}
        />
      </PSection>

      {/* §4 수임료 — 기존 기준 참조 (새 숫자를 만들지 않는다) */}
      <PSection title="수임료" lead="비용을 처음부터 알려드립니다.">
        <FeeBox
          amount="소송 착수금 400만 원부터"
          promise="승산이 낮은 소송은 권하지 않습니다. 상담에서는 다툼이 되는 항목별로, 가능성부터 함께 따져봅니다."
        >
          <FeeText>
            소송 사건은 건설·공사대금 분야의 착수금 기준(수임료 페이지 표와 동일)을 따르고, 영문
            공사계약 검토·자문은 기업 법무의 시간당 자문료 기준을 준용합니다. 플랜트 사건은 소가와
            쟁점 수에 따라 계약 전 서면 견적으로 안내드립니다.
          </FeeText>
        </FeeBox>
        <MoreLink href="/fees">수임료 자세히 보기 →</MoreLink>
      </PSection>

      {/* §5 FAQ */}
      <PSection title="자주 묻는 질문" lead="상담 전에 가장 많이 물으시는 것들입니다.">
        <FaqAccordion
          items={[
            {
              q: '지체상금이 계약금액의 10%를 넘게 청구됐습니다.',
              a: '청구된 총액이 그대로 인정되는 것은 아닙니다. 계약에 지체상금 상한 조항이 있는 경우가 많고, 상한이 없더라도 지체상금은 손해배상액의 예정으로서 감액이 다투어질 수 있는 영역입니다. 무엇보다 지연 일수 전체가 시공자 책임인지 — 발주처 사유·설계변경·불가항력 등 공기연장(EOT) 사유에 해당하는 구간이 있는지 — 를 구간별로 나눠 정리하는 것이 다툼의 순서입니다.',
            },
            {
              q: '발주처가 성능시험 결과를 인정하지 않습니다.',
              a: '성능보증 다툼은 결과 수치만의 문제가 아닙니다. 시험이 계약에서 정한 조건과 절차대로 진행되었는지 — 원료·부하 조건, 측정 방법, 입회와 통지 — 자체가 쟁점이 되는 경우가 많습니다. 계약서의 성능보증·시험 규정과 시험 기록을 나란히 놓고, 결과와 절차 양쪽에서 다툴 지점을 정리하는 것이 시작입니다.',
            },
            {
              q: '영문 계약서인데 국내 소송이 가능한가요?',
              a: '계약서의 준거법 조항과 관할(또는 중재) 조항에 따라 달라집니다. 어느 나라 법이 적용되고 분쟁을 어디에서 다루기로 정했는지 확인하는 것이 첫 단계이고, 그에 따라 대응의 경로가 갈립니다. 해외 발주처·원청과의 계약은 계약서 검토와 클레임 대응 자문까지 합니다.',
            },
            {
              q: '상담만 받고 결정해도 되나요?',
              a: '네. 상담 후 진행하지 않기로 정하셔도 됩니다. 먼저 상황을 정확히 아는 것이 시작입니다.',
            },
          ]}
        />
      </PSection>

      {/* 관련 가이드 — 플랜트 태그 우선, 없으면 건설 일반 (지침 작업 3) */}
      <PracticeResources field="construction" preferTag="plant" />

      {/* §6 CTA — 표준 + 변형 문구 */}
      <PracticeCta
        lead={
          <>
            계약서·클레임 서신을 먼저 보내주셔도 됩니다.
            <br />
            다툼이 되는 지점부터 함께 짚어보겠습니다.
          </>
        }
      />
    </>
  );
}
