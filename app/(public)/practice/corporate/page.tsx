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
  ResourceList,
  PracticeCta,
} from '../../../../components/practice/PracticeShared';
import { PracticeCases } from '../../../../components/practice/PracticeCases';
import { getAllSuccessCases } from '../../../../api/successCases';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: '평택 기업 법무 변호사 | 계약서 검토·법인 등기 | 법무법인 명' },
  description:
    'GS건설·롯데건설 사내변호사 출신이 계약서 검토·작성, 분쟁 초기 대응, 법인 등기를 다룹니다. 정기 자문 없이 건 단위 이용, 시간당 자문료 25만원.',
  openGraph: {
    title: '평택 기업 법무 변호사 | 계약서 검토·법인 등기 | 법무법인 명',
    description:
      'GS건설·롯데건설 사내변호사 출신이 계약서 검토·작성, 분쟁 초기 대응, 법인 등기를 다룹니다. 정기 자문 없이 건 단위 이용, 시간당 자문료 25만원.',
  },
  alternates: { canonical: '/practice/corporate' },
};

export default async function CorporatePage() {
  const cases = await getAllSuccessCases().catch(() => []);

  return (
    <>
      <PracticeHeader
        crumb="기업 법무"
        title="기업 법무"
        sub="기업 안에서 법무를 해본 변호사가 다룹니다."
      />

      {/* §2 도입 — "법무팀 없는 회사의 현실" 문법 (지침 2-8) */}
      <PSection>
        <PBody>
          법무팀이 없는 회사의 사정은 비슷합니다. 계약서는 상대방이 보내온 초안에 서명하고, 거래는
          관행대로 진행되고, 변호사는 문제가 터진 뒤에야 찾게 됩니다. 그런데 분쟁 단계에서 다투게 되는
          것의 상당수는, 계약서를 쓰던 그 시점에 정해져 있던 것들입니다.
        </PBody>
        <PBody>
          법무법인 명의 대표변호사는 GS건설과 롯데건설에서 사내변호사로 일했습니다. 회사 안에서 계약이
          만들어지고, 이행되고, 분쟁이 되는 과정을 지켜본 경력입니다. 그래서 계약서의 어느 조항이
          나중에 문제가 되는지, 분쟁의 조짐이 보일 때 무엇부터 해야 하는지를 기업의 관점에서 다룹니다.
        </PBody>
        <PBody>
          건설회사와 외국계 회사의 계약서 검토·작성, 분쟁 초기 대응을 수행해 왔습니다. 정기 자문
          계약이 없어도 됩니다. 계약서 한 건, 사안 하나 단위로 필요한 만큼 이용하실 수 있습니다.
        </PBody>
      </PSection>

      {/* §3 이런 상황이라면 */}
      <PSection title="이런 상황이라면" lead="하나라도 해당된다면, 이 페이지가 도움이 됩니다.">
        <SituationList
          items={[
            { text: '상대방이 보내온 계약서에 그대로 서명해도 될지 불안하다' },
            { text: '중요한 거래인데 계약서 없이, 또는 오래된 양식으로 진행하고 있다' },
            { text: '거래처와 분쟁의 조짐이 보이거나, 내용증명을 받았다' },
            { text: '법인 설립이나 임원 변경 등 등기가 필요하다', grp: true },
            { text: '외국 본사와의 계약·등기 문제를 영어로 처리해야 한다' },
          ]}
        />
      </PSection>

      {/* §4 하는 일 4종 (타임라인 컴포넌트 재사용, 지침 2-8) */}
      <PSection title="이런 일을 합니다" lead="정기 자문 없이, 건 단위로 이용하실 수 있습니다.">
        <ProcedureTimeline
          steps={[
            {
              title: '계약서 검토와 작성',
              desc: '상대방이 보내온 초안의 검토, 우리 쪽 초안의 작성, 조항 협상의 지원까지. 분쟁 단계에서 다투게 될 지점을 계약 단계에서 정리합니다.',
              can: '공급·용역·하도급 계약, 공사 관련 계약, 영문 계약까지 다룹니다.',
            },
            {
              title: '분쟁 초기 대응',
              desc: '내용증명을 받았거나 보내야 할 때, 거래처와의 다툼이 시작될 조짐이 보일 때 — 소송 전 단계에서 위치를 잡는 일입니다. 소송까지 가면 법령과 계약이 요구하는 통지가 제때 있었는지부터 다투어지는 경우가 많습니다. 계약의 해지·해제가 이행을 요구하는 최고 통지를 먼저 거쳐야 하는 것이 대표적입니다.',
              can: '사실관계와 계약의 검토, 필요한 통지의 설계와 발송, 소송으로 갈 사안인지의 판단. 미리 갖춰 둔 통지는 소송에서 그대로 쓰이고, 협의의 계기가 되기도 합니다.',
            },
            {
              title: '법인 설립과 등기',
              desc: '법인 설립, 임원 변경, 본점 이전 등 회사의 등기 업무를 처리합니다.',
              can: '외국 기업의 한국 법인·지점 등기까지 다룹니다.',
            },
            {
              title: '소송이 필요해지면',
              desc: '분쟁이 소송으로 가야 하는 사안이라면, 공사대금·민사 소송으로 이어서 진행합니다. 계약 단계부터 본 사건은 소송에서도 빠르게 잡힙니다.',
              can: (
                <>
                  <Link href="/practice/construction" className="underline hover:text-brand-dark">
                    건설·공사대금
                  </Link>
                  ,{' '}
                  <Link href="/practice/civil" className="underline hover:text-brand-dark">
                    민사 소송
                  </Link>{' '}
                  페이지에서 자세히 보실 수 있습니다.
                </>
              ),
            },
          ]}
          close="필요하지 않은 일은 권하지 않습니다. 계약서 한 건의 검토로 충분한 일이라면, 그렇게 말씀드립니다."
        />
      </PSection>

      {/* §5 외국 기업 (#foreign 앵커) */}
      <PSection id="foreign" tinted title="외국 기업의 한국 법무" lead="본사와 영어로 직접 소통합니다.">
        <PBody>
          한국에 진출한 외국 기업의 법무는 소통에서 막히는 경우가 많습니다. 한국 변호사와 본사 사이에
          통역과 요약이 오가는 동안, 정작 중요한 뉘앙스가 사라집니다.
        </PBody>
        <PBody>
          법무법인 명은 본사 담당자·본사 법무팀과 영어 이메일로 직접 소통하며 일합니다. 외국계 회사의
          계약서 검토·작성을 영문으로 수행해 왔고, 외국 기업의 한국 법인 등기 업무를 다룹니다.
          평택·캠프 험프리스 지역의 외국인 고객을 위한 영문 홈페이지도 운영하고 있습니다.
        </PBody>
        <PBody className="!font-medium !text-brand-dark">
          Contracts, corporate registration, and dispute response — handled directly in English.{' '}
          <a
            href="https://lsfp.co.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#8a6f4d] hover:underline"
          >
            (영문 사이트: lsfp.co.kr)
          </a>
        </PBody>
      </PSection>

      {/* §6 FAQ */}
      <PSection title="자주 묻는 질문" lead="상담 전에 가장 많이 물으시는 것들입니다.">
        <FaqAccordion
          items={[
            {
              q: '계약서 한 건만 검토받아도 되나요?',
              a: '네. 정기 자문 계약 없이 계약서 한 건 단위로 이용하실 수 있습니다. 회사에 법무 수요가 매일 있는 것은 아니기 때문에, 필요한 시점에 필요한 만큼 쓰시는 것이 합리적입니다.',
            },
            {
              q: '계약서 검토에서는 무엇을 봐 주나요?',
              a: '불리한 조항이 있는지, 분쟁이 생겼을 때 문제가 될 조항이 무엇인지, 우리 쪽에 필요한 조항이 빠져 있지 않은지를 보고 검토 의견을 드립니다. 조항을 직접 고쳐 쓰는 수정안 작성은 검토보다 시간이 더 드는 별도 업무여서, 필요하신 경우 추가 비용과 함께 미리 안내드립니다.',
            },
            {
              q: '내용증명을 받았습니다. 바로 변호사가 필요한가요?',
              a: '내용증명 자체에 법적 강제력이 있는 것은 아닙니다. 다만 상대방이 분쟁을 준비하고 있다는 신호이고, 여기에 어떻게 답하는지가 이후 소송에서 증거가 됩니다. 답장을 보내기 전에 계약서와 함께 검토받으시길 권합니다.',
            },
            {
              q: '영문 계약서도 검토가 되나요?',
              a: '네. 외국계 회사의 영문 계약서 검토·작성을 수행해 왔고, 필요한 경우 본사 담당자와 영어로 직접 소통하며 진행합니다.',
            },
            {
              q: '상담만 받고 결정해도 되나요?',
              a: '네. 상담 후 진행하지 않기로 정하셔도 됩니다. 먼저 상황을 정확히 아는 것이 시작입니다.',
            },
          ]}
        />
      </PSection>

      {/* §7 성공사례 — 기업 실사례 게시 전까지 자동 미표시 (지침 1-4) */}
      <PracticeCases
        cases={cases}
        field="기업"
        title="기업 법무의 결과들"
        lead="결과는 기록으로 보여드립니다."
        moreLabel="사례 더 보기 →"
      />

      {/* §8 수임료 — cert 줄 없음 (마스터 플랜 2-1: 기업 미표기), 시간당 자문료 구조 */}
      <PSection title="수임료" lead="비용을 처음부터 알려드립니다.">
        <FeeBox
          amount="자문료 시간당 25만원"
          promise="필요하지 않은 일은 권하지 않습니다. 계약서 한 건의 검토로 충분한 일이라면, 그렇게 말씀드립니다."
        >
          <FeeText>
            계약서 검토·작성, 분쟁 초기 대응 등 기업 법무는 사안마다 분량과 난이도가 달라, 건당 정액
            대신 시간당 자문료를 기준으로 합니다. 착수 전에 내용을 확인해 예상 시간과 총액을 먼저
            안내드리고, 안내한 범위를 넘게 될 상황이면 진행 전에 협의드립니다.
          </FeeText>
        </FeeBox>
        <MoreLink href="/fees">수임료 자세히 보기 →</MoreLink>
      </PSection>

      {/* §9 도구·글 */}
      <PSection title="직접 확인해보실 수 있는 것들" lead="상담 전에 활용해 보세요.">
        <ResourceList
          items={[
            {
              label: '계약서에서 먼저 확인할 조항들',
              tag: '법률정보',
              href: '/insights?category=기업',
            },
            {
              label: '내용증명을 받았을 때 하지 말아야 할 것',
              tag: '법률정보',
              href: '/insights?category=기업',
            },
            { label: '법정 이자 계산기', tag: '스마트 도구', href: '/tools#interest-calculator' },
            { label: '증거 수집 가이드', tag: '스마트 도구', href: '/tools#evidence-guide' },
          ]}
        />
      </PSection>

      {/* §10 CTA */}
      <PracticeCta
        lead={
          <>
            먼저 상황을 정확히 아는 것이 시작입니다.
            <br />
            진행 여부는 그다음에 정하셔도 됩니다.
          </>
        }
      />
    </>
  );
}
