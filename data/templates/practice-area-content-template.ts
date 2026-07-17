/**
 * [빈 양식] 업무 분야 콘텐츠 데이터 템플릿 (지침 14-4 산출물)
 *
 * 사용 방법:
 * 1. 이 파일을 data/content/<slug>.ts 로 복사한다. (예: data/content/construction-payment.ts)
 * 2. 아래 모든 필드를 변호사 검수를 거친 실제 콘텐츠로 채운다.
 * 3. 검수 완료 후 reviewedBy에 "검수자 이름 YYYY-MM-DD"를 기입한다.
 *    reviewedBy가 비어 있으면 페이지는 noindex 상태로 유지된다.
 * 4. data/practice-areas.ts의 CONTENT에 import하여 등록한다.
 *    예) import { constructionPayment } from './content/construction-payment';
 *        export const CONTENT = { 'construction-payment': constructionPayment };
 *
 * 주의:
 * - 확인되지 않은 경력·자격·사건 결과를 쓰지 않는다.
 * - "승소율 N%", "최고", "1위" 등 검증 불가·과장 표현을 쓰지 않는다. (변호사 광고규정)
 * - attorneyExperience는 반드시 변호사 본인이 검수한다.
 */

import type { PracticeAreaContent } from '../practice-areas';

export const template: PracticeAreaContent = {
  slug: '',                     // 예: 'construction-payment' (라우트와 일치해야 함)
  title: '',                    // 예: '공사대금 소송'
  metaTitle: '',                // 예: '평택 공사대금 변호사 | 법무법인 명'
  metaDescription: '',          // 검색 결과에 노출될 120~150자 설명

  // 도입부 2-3문단. 의뢰인이 처한 상황에 공감하고 페이지가 다룰 내용을 안내.
  intro: ``,

  // 대표적인 사건 유형 (예: '유치권 분쟁', '지체상금 청구' ...)
  caseTypes: [],

  // 자주 발생하는 법률 쟁점과 짧은 해설
  legalIssues: [
    // { issue: '', explanation: '' },
  ],

  // 사건 초기에 해야 할 일 / 하지 말아야 할 일
  initialResponse: ``,

  // 필요한 증거와 서류 목록
  requiredEvidence: [],

  // 일반적인 진행 절차 (단계별)
  procedure: [
    // { step: '', description: '' },
  ],

  // 변호사 선임이 필요한 시점
  whenToHireLawyer: ``,

  // 최철호 변호사의 관련 경험 — 반드시 사실만, 변호사 검수 필수
  attorneyExperience: ``,

  // 관련 성공사례 id 목록 (예: ['50', '43'])
  relatedCaseSlugs: [],

  // 관련 법률정보 id 목록 (예: ['86'])
  relatedInsightSlugs: [],

  // 자주 묻는 질문
  faq: [
    // { question: '', answer: '' },
  ],

  // 미지정 시 공통 면책문구가 사용됨. 분야별 문구가 필요할 때만 작성.
  // disclaimer: '',

  // 검수자와 검수일. 비어 있으면 이 콘텐츠는 배포(index)되지 않는다.
  reviewedBy: '',
};
