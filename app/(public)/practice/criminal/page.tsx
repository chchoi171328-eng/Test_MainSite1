import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PracticeHeader,
  PSection,
  PBody,
  SituationList,
  ProcedureTimeline,
  FaqAccordion,
  FeeBox,
  FeeText,
  MoreLink,
  PracticeCta,
} from '../../../../components/practice/PracticeShared';
import { PracticeCases } from '../../../../components/practice/PracticeCases';
import { PracticeResources } from '../../../../components/practice/PracticeResources';
import { getAllCases } from '../../../../lib/cases';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: '평택 형사 변호사 | 수사·재판 단계별 대응 | 법무법인 명' },
  description:
    '경찰 조사 전부터 재판까지, 지금 단계에서 할 수 있는 것을 안내합니다. 대한변호사협회 등록 형사법·민사법 전문변호사가 직접 상담합니다.',
  openGraph: {
      url: './',
    title: '평택 형사 변호사 | 수사·재판 단계별 대응 | 법무법인 명',
    description:
      '경찰 조사 전부터 재판까지, 지금 단계에서 할 수 있는 것을 안내합니다. 대한변호사협회 등록 형사법·민사법 전문변호사가 직접 상담합니다.',
  },
  alternates: { canonical: '/practice/criminal' },
};

export default async function CriminalPage() {
  const cases = getAllCases();

  return (
    <>
      <PracticeHeader
        crumb="형사 변호"
        title="형사 변호"
        sub="지금 어느 단계인지에 따라, 가능한 대응이 다릅니다."
      />

      {/* §2 도입 */}
      <PSection>
        <PBody>
          경찰에서 연락을 받으면 대부분 두 가지가 먼저 떠오릅니다. 전과가 남을까, 직장이나 가족에게
          알려질까.
        </PBody>
        <PBody>
          결론부터 말씀드리면, 같은 혐의라도 가능한 결과의 폭은 사건마다 다릅니다. 그리고 그 폭은 지금
          사건이 어느 단계에 있는지, 그 단계에서 무엇을 하는지에 따라 정해집니다. 아래에서 단계별로
          확인하실 수 있습니다.
        </PBody>
        <PBody className="!text-sm !text-[#8a6f4d]">
          범죄 피해를 입어 고소를 준비하고 계신 분은{' '}
          <Link href="/practice/criminal-victim" className="text-brand-gold font-medium hover:underline">
            피해자·고소 대응 안내
          </Link>
          에서 확인하실 수 있습니다.
        </PBody>
      </PSection>

      {/* §3 이런 상황이라면 */}
      <PSection title="이런 상황이라면" lead="하나라도 해당된다면, 이 페이지가 도움이 됩니다.">
        <SituationList
          items={[
            { text: '경찰서에서 출석 요구 연락을 받았다' },
            { text: '음주운전·음주측정거부로 조사를 앞두고 있다' },
            { text: '다툼이 있었는데 쌍방폭행으로 입건되었다' },
            { text: '사기 혐의로 고소를 당했다' },
            { text: '가족이 체포되었거나 조사를 받고 있다' },
            { text: '경찰에서 검찰로 사건이 송치되었다', grp: true },
            { text: '검찰에서 기소되어 재판을 앞두고 있다 (공소장을 받았다)' },
            { text: '약식명령을 받았는데 정식재판을 청구할지 고민이다' },
          ]}
        />
      </PSection>

      {/* §4 타임라인 */}
      <PSection title="형사 사건은 이렇게 진행됩니다" lead="지금 어느 단계인지 확인해 보세요.">
        <ProcedureTimeline
          steps={[
            {
              title: '경찰 조사 전',
              desc: '출석 요구를 받았거나 조사를 앞둔 단계입니다.',
              can: '할 수 있는 것 — 진술 방향을 정리하고 첫 조사를 준비합니다. 선택지가 가장 많이 남아 있는 시기입니다.',
            },
            {
              title: '경찰 조사',
              desc: '피의자 신분으로 조사를 받습니다. 이때의 진술이 기록으로 남아 끝까지 따라갑니다.',
              can: '할 수 있는 것 — 변호인 동석, 진술 전 사실관계 정리, 조서 열람 후 수정 요청. 경찰의 질문을 통해 상대방의 주장을 파악할 수도 있습니다.',
            },
            {
              title: '송치 / 불송치 결정 전',
              desc: '조사를 마친 경찰이 사건을 검찰에 보낼지(송치), 자체 종결할지(불송치) 판단하는 시기입니다.',
              can: '할 수 있는 것 — 유리한 증거 제출, 탄원서 제출, 의견서 제출(필요한 경우). 결정이 내려지기 전이 마지막으로 적극 대응할 수 있는 시점입니다.',
            },
            {
              title: '검찰 처분 전',
              desc: '송치된 사건을 검사가 기소, 불기소(기소유예 포함), 약식명령 청구 등으로 판단하는 시기입니다. 검사가 직접 조사하는 경우도 있습니다.',
              can: '할 수 있는 것 — 양형 자료 제출, 피해 회복·합의 진행, 의견서 제출(필요한 경우). 처분이 내려지기 전에 하는 대응입니다.',
            },
            {
              title: '재판 (공판)',
              desc: '기소된 경우 법원에서 유무죄와 형이 정해집니다.',
              can: '할 수 있는 것 — 증거에 대한 의견(증거인부), 증인신문, 변론. 유리한 추가 증거 제출, 반성문·탄원서 제출.',
            },
          ]}
          close="단계가 뒤로 갈수록 선택지는 줄어듭니다. 그래서 형사 사건은 지금 단계를 정확히 아는 것이 첫 번째입니다."
        />
      </PSection>

      {/* §6 FAQ */}
      {/* 이 분야의 성공사례 — field 일치 최대 3건(featured 우선), 0건 시 미렌더링 */}
      <PracticeCases cases={cases} field="criminal" />

      <PSection title="자주 묻는 질문" lead="상담 전에 가장 많이 물으시는 것들입니다.">
        <FaqAccordion
          items={[
            {
              q: '초범이면 처벌이 어떻게 되나요?',
              a: '초범이라는 사정은 유리하게 고려되지만, 결과는 죄명·피해 정도·합의 여부에 따라 크게 달라집니다. 같은 혐의의 초범이라도 기소유예로 끝나는 경우와 재판까지 가는 경우가 모두 있습니다. 사건 내용을 들어야 가능한 범위를 말씀드릴 수 있습니다.',
            },
            {
              q: '경찰 조사에 변호사가 꼭 동행해야 하나요?',
              a: '모든 사건에 필수는 아닙니다. 다만 첫 조사의 진술은 기록으로 남아 이후 절차 전체에 영향을 주기 때문에, 동행 여부와 별개로 조사 전에 사실관계를 정리하고 가시는 것은 권합니다.',
            },
            {
              q: '회사나 가족에게 알려지나요?',
              a: (
                <>
                  직장과 집을 나눠서 말씀드립니다. <strong>직장</strong>에는 통보되지 않는 것이
                  원칙입니다. 조사 일정은 수사기관이 피의자 본인에게 직접 연락해 조율하고, 공무원처럼
                  자동 통보 규정이 적용되는 일부 직군이 아니라면 회사로 통보가 가지 않습니다.{' '}
                  <strong>집</strong>의 경우, 송치·불송치 결정 같은 공식 절차는 주거지로 우편이 발송될
                  수 있습니다. 다만 우편물 수령 주소는 변경할 수 있어, 가족에게 알려지는 것이
                  걱정되신다면 상담에서 방법을 함께 정리해 드립니다.
                </>
              ),
              aText:
                '직장과 집을 나눠서 말씀드립니다. 직장에는 통보되지 않는 것이 원칙입니다. 조사 일정은 수사기관이 피의자 본인에게 직접 연락해 조율하고, 공무원처럼 자동 통보 규정이 적용되는 일부 직군이 아니라면 회사로 통보가 가지 않습니다. 집의 경우, 송치·불송치 결정 같은 공식 절차는 주거지로 우편이 발송될 수 있습니다. 다만 우편물 수령 주소는 변경할 수 있어, 가족에게 알려지는 것이 걱정되신다면 상담에서 방법을 함께 정리해 드립니다.',
            },
            {
              q: '변호사 없이 혼자 대응해도 되는 사건도 있나요?',
              a: '네, 있습니다. 사실관계가 단순하고 다툼이 없는 경미한 사건은 혼자 대응하셔도 됩니다. 상담에서 선임이 필요한 사건인지부터 말씀드립니다.',
            },
            {
              q: '상담만 받고 결정해도 되나요?',
              a: '네. 상담 후 의뢰하지 않으셔도 됩니다. 먼저 상황을 정확히 아는 것이 시작입니다.',
            },
          ]}
        />
      </PSection>

      {/* §8 수임료 */}
      <PSection title="수임료" lead="비용을 처음부터 알려드립니다.">
        <FeeBox amount="착수금 400~1,200만 원" cert>
          <FeeText>
            사건 단계와 사실관계 복잡도에 따라 달라집니다. 정확한 금액은 사건 검토 후 안내드리고, 진행
            중에 갑자기 늘어나지 않습니다.
          </FeeText>
        </FeeBox>
        <MoreLink href="/fees">수임료 자세히 보기 →</MoreLink>
      </PSection>
      {/* §9 도구·글 — 가이드 frontmatter와 스마트 도구에서 빌드 시 자동 생성 (지침 작업 5) */}
      <PracticeResources field="criminal" />

      {/* §10 CTA */}
      <PracticeCta
        lead={
          <>
            먼저 상황을 정확히 아는 것이 시작입니다.
            <br />
            의뢰 여부는 그다음에 정하셔도 됩니다.
          </>
        }
      />
    </>
  );
}
