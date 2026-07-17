/**
 * 업무 분야 상세 페이지 콘텐츠 데이터 (지침 5단계·14단계)
 *
 * 원칙:
 * - 법률 콘텐츠 본문은 이 저장소에서 창작하지 않는다. 사용자(변호사)가 검수한
 *   데이터가 CONTENT에 등록되어야 페이지가 완성된다.
 * - reviewedBy가 없는 콘텐츠는 noindex 상태로 유지된다.
 * - 빈 양식은 data/templates/practice-area-content-template.ts 참조.
 */

/** 지침 14-1 콘텐츠 데이터 스키마 */
export interface PracticeAreaContent {
  slug: string;                 // 예: "construction-payment"
  title: string;                // 예: "공사대금 소송"
  metaTitle: string;            // 예: "평택 공사대금 변호사 | 법무법인 명"
  metaDescription: string;
  intro: string;                // 도입부 2-3문단
  caseTypes: string[];          // 대표적인 사건 유형
  legalIssues: { issue: string; explanation: string }[];
  initialResponse: string;      // 초기 대응 방법
  requiredEvidence: string[];   // 필요한 증거와 서류
  procedure: { step: string; description: string }[];
  whenToHireLawyer: string;
  attorneyExperience: string;   // 최철호 변호사 관련 경험 (사용자 검수 필수)
  relatedCaseSlugs: string[];   // 관련 성공사례 (숫자 id 문자열)
  relatedInsightSlugs: string[];
  faq: { question: string; answer: string }[];
  disclaimer?: string;          // 미지정 시 공통 면책문구 사용
  reviewedBy: string;           // 검수자 및 검수일. 예: "최철호 2026-07-15"
}

/** 라우트·내비게이션용 기본 정보 (콘텐츠 아님) */
export interface PracticeAreaDefinition {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
}

/** 지침 6장(2단계)에 정의된 7개 업무 분야 라우트 */
export const PRACTICE_AREA_DEFINITIONS: PracticeAreaDefinition[] = [
  {
    slug: 'real-estate-litigation',
    title: '부동산 소송',
    metaTitle: '평택 부동산 변호사 | 법무법인 명',
    metaDescription:
      '평택 법무법인 명의 부동산 소송 안내. 매매·임대차 분쟁 등 부동산 사건을 상담합니다.',
  },
  {
    slug: 'construction-disputes',
    title: '건설 분쟁',
    metaTitle: '평택 건설 변호사 | 법무법인 명',
    metaDescription:
      '평택 법무법인 명의 건설 분쟁 안내. GS건설·롯데건설 사내변호사 출신 대표변호사가 상담합니다.',
  },
  {
    slug: 'construction-payment',
    title: '공사대금 소송',
    metaTitle: '평택 공사대금 변호사 | 법무법인 명',
    metaDescription:
      '평택 법무법인 명의 공사대금 소송 안내. 공사대금 청구·방어 사건을 상담합니다.',
  },
  {
    slug: 'civil-litigation',
    title: '민사소송',
    metaTitle: '평택 민사소송 변호사 | 법무법인 명',
    metaDescription:
      '평택 법무법인 명의 민사소송 안내. 계약 분쟁, 손해배상 등 민사 사건을 상담합니다.',
  },
  {
    slug: 'debt-collection',
    title: '대여금·채권 회수',
    metaTitle: '평택 대여금 변호사 | 법무법인 명',
    metaDescription:
      '평택 법무법인 명의 대여금·채권 회수 안내. 대여금 청구, 채권 보전·집행 사건을 상담합니다.',
  },
  {
    slug: 'criminal-defense',
    title: '형사 변호',
    metaTitle: '평택 형사 변호사 | 법무법인 명',
    metaDescription:
      '평택 법무법인 명의 형사 변호 안내. 수사 초기 단계부터 공판까지 형사 사건을 상담합니다.',
  },
  {
    slug: 'divorce-inheritance',
    title: '이혼·상속',
    metaTitle: '평택 이혼·상속 변호사 | 법무법인 명',
    metaDescription:
      '평택 법무법인 명의 이혼·상속 안내. 이혼, 재산분할, 상속 분쟁 사건을 상담합니다.',
  },
  {
    slug: 'corporate-law',
    title: '기업 법무',
    metaTitle: '평택 기업법무 변호사 | 법무법인 명',
    metaDescription:
      '평택 법무법인 명의 기업 법무 안내. 계약서 검토·자문, 기업 분쟁 대응, 인사·노동 사건을 상담합니다.',
  },
];

/**
 * 검수 완료된 콘텐츠 등록부.
 * 사용자가 제공한 데이터 파일을 import하여 여기에 연결한다.
 * 예) import { constructionPayment } from './content/construction-payment';
 *     'construction-payment': constructionPayment,
 */
export const CONTENT: Record<string, PracticeAreaContent | undefined> = {
  // 현재 모든 분야 콘텐츠 대기 상태 (지침 14-3 우선순위에 따라 사용자 제공 예정)
};

/** 공통 면책 문구 (콘텐츠에 disclaimer 미지정 시 사용) */
export const DEFAULT_DISCLAIMER =
  '본 페이지의 내용은 일반적인 정보 제공을 목적으로 하며, 구체적인 사안에 대한 법률 자문이 아닙니다. 개별 사건에 대해서는 반드시 변호사와 상담하시기 바랍니다.';

export function getPracticeAreaDefinition(slug: string): PracticeAreaDefinition | undefined {
  return PRACTICE_AREA_DEFINITIONS.find((d) => d.slug === slug);
}

/** 검수(reviewedBy) 완료된 콘텐츠만 반환 — 미검수 콘텐츠는 노출하지 않는다 */
export function getReviewedContent(slug: string): PracticeAreaContent | undefined {
  const content = CONTENT[slug];
  if (!content || !content.reviewedBy.trim()) return undefined;
  return content;
}
