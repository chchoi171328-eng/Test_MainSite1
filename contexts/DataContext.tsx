import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SuccessCase, LegalPost, LegalForm, LegalCase } from '../types';

interface DataContextType {
  successCases: SuccessCase[];
  legalPosts: LegalPost[];
  legalForms: LegalForm[];
  legalCases: LegalCase[];
  
  addSuccessCase: (item: Omit<SuccessCase, 'id'>) => void;
  updateSuccessCase: (item: SuccessCase) => void;
  deleteSuccessCase: (id: number) => void;

  addLegalPost: (item: Omit<LegalPost, 'id'>) => void;
  updateLegalPost: (item: LegalPost) => void;
  deleteLegalPost: (id: number) => void;

  addLegalForm: (item: Omit<LegalForm, 'id'>) => void;
  updateLegalForm: (item: LegalForm) => void;
  deleteLegalForm: (id: number) => void;

  addLegalCase: (item: Omit<LegalCase, 'id'>) => void;
  updateLegalCase: (item: LegalCase) => void;
  deleteLegalCase: (id: number) => void;
}

// Initial Data
const INITIAL_SUCCESS_CASES: SuccessCase[] = [
  {
    id: 1,
    title: "대기업 횡령 및 배임 혐의 무죄 판결",
    category: "형사",
    result: "무죄",
    description: "복잡한 회계 분석과 치밀한 법리 구성을 통해 의뢰인의 억울함을 밝혀내고 무죄 판결을 이끌어냈습니다."
  },
  {
    id: 2,
    title: "100억 원대 건설 공사 대금 청구 승소",
    category: "민사/건설",
    result: "전부 승소",
    description: "계약서의 독소 조항을 무력화하고, 실제 수행한 공사 내역을 입증하여 청구 금액 전액을 인정받았습니다."
  },
  {
    id: 3,
    title: "이혼 재산분할 및 양육권 방어",
    category: "가사",
    result: "조정 성립",
    description: "의뢰인에게 유리한 재산 형성 기여도를 입증하고, 자녀 복리를 최우선으로 한 양육 계획을 통해 양육권을 확보했습니다."
  }
];

const INITIAL_LEGAL_POSTS: LegalPost[] = [
  {
    id: 1,
    title: "2024년 건설산업기본법 개정안 핵심 해설",
    category: "건설/부동산",
    date: "2024. 02. 15",
    summary: "하도급 대금 보호 강화 및 불법 하도급 처벌 규정이 대폭 강화되었습니다. 건설사 및 시행사가 반드시 알아야 할 개정 사항을 정리해 드립니다.",
    content: `2024년 2월부터 시행되는 건설산업기본법 개정안은 건설 현장의 불공정 관행을 근절하고 안전을 강화하는 데 중점을 두고 있습니다.

주요 변경 사항은 다음과 같습니다:

1. 불법 하도급에 대한 처벌 강화
기존에는 적발 시 영업정지 처분에 그쳤으나, 이제는 징벌적 손해배상 제도가 도입되어 하도급 대금의 최대 3배까지 배상해야 할 수 있습니다. 또한, 불법 하도급을 지시하거나 공모한 원청 업체에 대한 형사 처벌 수위도 상향 조정되었습니다.

2. 하도급 대금 지급 보증 의무 확대
소규모 공사라 하더라도 하도급 대금 지급 보증서 발급이 의무화됩니다. 이를 위반할 경우 과태료 부과 대상이 되며, 발주자가 하도급 대금을 직접 지급해야 하는 사유도 확대되었습니다.

3. 건설 안전 관련 규제 정비
안전관리비 계상 기준이 현실화되고, 안전 관리 소홀로 인한 사고 발생 시 입찰 참가 자격 제한 기간이 늘어납니다.

건설사와 시행사는 이번 개정안을 숙지하여 불필요한 법적 분쟁을 예방하고, 현장 관리에 만전을 기해야 할 것입니다.`
  },
  {
    id: 2,
    title: "가상화폐(코인) 이혼 재산분할 산정 기준",
    category: "가사/이혼",
    date: "2024. 01. 20",
    summary: "변동성이 큰 가상자산을 재산분할 대상에 포함시킬 때의 평가 시점과 은닉된 가상자산을 추적하는 실무적 방법에 대해 알아봅니다.",
    content: `최근 가상화폐(암호화폐)가 주요 자산 증식 수단으로 자리 잡으면서, 이혼 소송 시 재산분할 대상에 포함되는지, 포함된다면 가치를 어떻게 산정해야 하는지가 큰 쟁점이 되고 있습니다.

1. 재산분할 대상 여부
법원은 가상화폐 역시 경제적 가치가 있는 재산으로 보아 재산분할 대상으로 인정하고 있습니다. 다만, 상대방이 가상화폐 보유 사실을 숨길 경우 이를 찾아내는 것이 관건입니다.

2. 가치 산정 시점
가상화폐는 가격 변동성이 매우 큽니다. 원칙적으로 재산분할의 기준 시점은 '사실심 변론 종결일'입니다. 즉, 재판이 끝날 때의 시세를 기준으로 가치를 평가합니다. 그러나 변론 종결일 직전에 급등락이 있을 경우, 형평성을 고려하여 별도의 기준을 정하기도 합니다.

3. 은닉 가상자산 추적 방법
상대방이 거래소 지갑에 코인을 보관하고 있다면 법원을 통해 금융거래정보 제출 명령을 신청하여 거래 내역을 확보할 수 있습니다. 하지만 개인 지갑(콜드월렛)에 보관 중이라면 추적이 까다로울 수 있어, 디지털 포렌식 등 전문적인 조력이 필요할 수 있습니다.

법무법인 명은 가상자산 관련 전문 지식을 바탕으로 의뢰인의 정당한 몫을 찾아드리기 위해 최선을 다하고 있습니다.`
  },
  {
    id: 3,
    title: "전세보증금 반환소송 실무 가이드",
    category: "민사",
    date: "2023. 12. 10",
    summary: "임대차 계약 종료 후 보증금을 돌려받지 못할 때, 내용증명 발송부터 임차권등기명령, 지급명령 및 보증금 반환 청구 소송까지의 절차를 안내합니다.",
    content: `임대차 계약이 종료되었음에도 불구하고 집주인이 보증금을 돌려주지 않는 '전세 사기' 및 '보증금 미반환' 사례가 급증하고 있습니다. 이에 대한 단계별 법적 대응 방법을 안내해 드립니다.

Step 1. 계약 해지 통보 및 내용증명 발송
계약 만료 6개월 전부터 2개월 전까지 갱신 거절의 의사를 명확히 밝혀야 합니다. 문자 메시지나 통화 녹음도 증거가 되지만, 우체국을 통한 내용증명 발송이 가장 확실한 방법입니다.

Step 2. 임차권등기명령 신청
이사(점유 이탈)를 해야 한다면 반드시 임차권등기명령을 신청하여 등기부등본에 기재된 것을 확인한 후 이사해야 합니다. 그래야만 대항력과 우선변제권이 유지됩니다.

Step 3. 지급명령 또는 전세보증금 반환 소송
집주인의 인적 사항이 명확하고 송달이 확실하다면 신속한 '지급명령'을 신청할 수 있습니다. 그러나 송달이 불확실하거나 다툼의 여지가 있다면 처음부터 정식 소송을 제기하는 것이 낫습니다.

Step 4. 강제집행 (경매)
판결문(집행권원)을 획득했음에도 보증금을 돌려주지 않는다면, 해당 부동산에 대한 강제경매를 신청하여 배당을 받아야 합니다.

이 모든 과정은 시간과의 싸움입니다. 초기 단계부터 변호사와 상담하여 전략적으로 대응하시기 바랍니다.`
  },
  {
    id: 4,
    title: "중대재해처벌법 확대 적용과 CEO의 대응",
    category: "기업법무",
    date: "2023. 11. 05",
    summary: "50인 미만 사업장까지 확대된 중대재해처벌법. 경영 책임자가 구축해야 할 안전보건 확보 의무와 리스크 관리 방안을 제시합니다.",
    content: `2024년부터 5인 이상 50인 미만 사업장에도 중대재해처벌법이 전면 적용됩니다. 이는 중소기업 대표님들에게 큰 부담이자 리스크로 다가오고 있습니다.

준비해야 할 핵심 사항:
1. 안전보건 관리체계 구축: 형식적인 서류 작업이 아닌, 실제 현장에서 작동하는 안전 매뉴얼을 수립해야 합니다.
2. 유해·위험 요인 확인 및 개선: 정기적인 위험성 평가를 실시하고, 발견된 위험 요인을 즉시 개선하며 그 기록을 보존해야 합니다.
3. 안전 예산 편성 및 집행: 안전 장비 구입, 교육 훈련 등에 필요한 예산을 별도로 편성하고 집행 내역을 증빙해야 합니다.
4. 종사자 의견 청취: 근로자의 안전 관련 건의 사항을 수렴하고 이를 경영에 반영하는 절차를 마련해야 합니다.

사고 발생 시 처벌 수위:
사망 사고 발생 시 경영 책임자는 1년 이상의 징역 또는 10억 원 이하의 벌금에 처해질 수 있습니다. 

법무법인 명은 기업 규모와 업종에 맞는 맞춤형 컴플라이언스 진단 서비스를 제공합니다.`
  },
  {
    id: 5,
    title: "유류분 제도 위헌 결정과 상속 분쟁의 변화",
    category: "상속",
    date: "2023. 10. 28",
    summary: "최근 헌법재판소의 유류분 제도 일부 위헌 결정이 실제 상속 소송에 미치는 영향과, 이에 따른 효과적인 증여 및 유언 전략을 분석합니다.",
    content: `헌법재판소가 형제자매에 대한 유류분을 규정한 민법 조항에 대해 위헌 결정을 내렸습니다. 또한, 패륜적인 행위를 한 상속인의 유류분 청구권을 인정하는 것 역시 헌법 불합치 판단을 받았습니다.

이번 결정의 의미:
1. 형제자매의 유류분 폐지: 이제 피상속인(고인)은 유언을 통해 형제자매에게 재산을 한 푼도 남기지 않을 수 있게 되었습니다. 이는 개인 재산 처분의 자유를 더 넓게 보장하는 변화입니다.
2. 기여분과 유류분의 관계 재정립: 부양 의무를 다하지 않거나 학대 등 범죄를 저지른 상속인이 유류분을 주장하는 것이 어려워질 전망입니다. 국회에서의 후속 입법이 예정되어 있습니다.

상속 전략의 변화:
과거에는 유류분 소송을 피하기 위해 기계적으로 재산을 분배했다면, 이제는 명확한 유언 공증과 증여 계획을 통해 피상속인의 의사를 더 확실히 실현할 수 있습니다.

상속 분쟁은 가족 간의 감정싸움으로 번지기 쉽습니다. 변화된 법리를 정확히 이해하고 미리 대비하는 지혜가 필요합니다.`
  },
  {
    id: 6,
    title: "음주운전 처벌 강화 및 면허 구제 절차",
    category: "형사",
    date: "2023. 09. 15",
    summary: "강화된 도로교통법에 따른 음주운전 처벌 수위와, 생계형 운전자를 위한 이의신청 및 행정심판 등 면허 구제 절차의 요건을 설명합니다.",
    content: `음주운전은 '잠재적 살인'이라는 사회적 인식 확산과 윤창호법 등 법 개정으로 인해 처벌 수위가 매우 높아졌습니다.

처벌 기준:
- 혈중알코올농도 0.03% ~ 0.08%: 면허 정지, 1년 이하 징역 또는 500만 원 이하 벌금
- 혈중알코올농도 0.08% ~ 0.2%: 면허 취소, 1년~2년 징역 또는 500만 원~1,000만 원 벌금
- 0.2% 이상: 2년~5년 징역 또는 1,000만 원~2,000만 원 벌금
- 2회 이상 적발 시 가중 처벌

면허 구제 절차 (이의신청 및 행정심판):
운전이 가족의 생계를 유지할 중요한 수단이거나, 위반 행위에 참작할 만한 사유가 있는 경우 행정심판을 통해 면허 취소를 정지로 감경받을 수 있습니다.
단, 혈중알코올농도가 0.1%를 초과하거나, 인명 피해가 있는 경우, 단속 경찰관을 폭행한 경우 등은 구제 대상에서 제외됩니다.

구제 확률을 높이기 위해서는 반성문, 탄원서, 부채 증명서, 재직 증명서 등 입증 자료를 철저히 준비해야 합니다.`
  }
];

const INITIAL_LEGAL_FORMS: LegalForm[] = [
  { id: 1, title: "지급명령신청서", category: "민사", format: "HWP", size: "15KB" },
  { id: 2, title: "부동산임대차계약서(표준)", category: "부동산", format: "HWP", size: "24KB" },
  { id: 3, title: "내용증명 양식(계약해지/독촉)", category: "공통", format: "DOCX", size: "18KB" },
  { id: 4, title: "차용증(금전소비대차계약서)", category: "민사", format: "HWP", size: "20KB" },
  { id: 5, title: "고소장(사기/횡령/배임)", category: "형사", format: "HWP", size: "30KB" },
  { id: 6, title: "채권가압류신청서", category: "민사/집행", format: "HWP", size: "22KB" },
  { id: 7, title: "근로계약서(정규직/계약직)", category: "노무", format: "DOCX", size: "25KB" },
  { id: 8, title: "협의이혼의사확인신청서", category: "가사", format: "HWP", size: "12KB" },
  { id: 9, title: "위임장(소송대리/업무대리)", category: "공통", format: "DOCX", size: "10KB" }
];

const INITIAL_LEGAL_CASES: LegalCase[] = [
  {
    id: 1,
    title: "부동산 이중매매 배임죄 성립 요건 판례",
    court: "대법원 2023. 5. 12. 선고",
    caseNumber: "2022도12345",
    summary: "부동산 매도인이 중도금을 수령한 이후 제3자에게 이중으로 매도하고 소유권이전등기를 경료해 준 사안에서, 타인의 사무를 처리하는 자로서의 지위와 배임죄 성립을 인정한 사례.",
    tags: ["형사", "부동산", "배임"],
    content: `[사건 개요]
피고인 A씨는 피해자 B씨에게 자신 소유의 토지를 매도하기로 계약하고 계약금 및 중도금을 수령하였습니다. 그러나 잔금 지급 기일 전에 해당 토지를 제3자인 C씨에게 더 높은 가격에 매도하고, C씨 명의로 소유권이전등기를 마쳤습니다. 이에 검찰은 A씨를 배임 혐의로 기소하였습니다.

[쟁점]
부동산 매매 계약에서 중도금을 수령한 매도인이 '타인의 사무를 처리하는 자'에 해당하는지, 그리고 이중매매 행위가 배임죄를 구성하는지 여부가 쟁점이 되었습니다.

[판결 요지]
대법원은 다음과 같이 판시하였습니다.
1. 부동산 매매계약에서 중도금이 지급되는 등 계약이 본격적으로 이행되는 단계에 이르면, 계약이 취소되거나 해제되지 않는 한 매도인은 매수인에게 소유권이전등기절차를 이행해 줄 의무가 있다.
2. 이러한 단계에서 매도인은 매수인의 재산적 이익을 보호·관리할 신임 관계에 있게 되므로, 매도인은 '타인의 사무를 처리하는 자'에 해당한다.
3. 그럼에도 불구하고 매도인이 제3자에게 부동산을 처분하고 등기를 넘겨준 행위는 매수인의 부동산 취득 협력 의무를 위배한 것으로서 배임죄가 성립한다.

[결론]
법원은 피고인 A씨에게 징역 1년 6월의 실형을 선고하였습니다. 이 판결은 부동산 거래의 안정성을 보호하고 매도인의 신의칙상 의무를 형사적으로 강제한다는 점에서 의의가 있습니다.`
  },
  {
    id: 2,
    title: "임차인의 권리금 회수기회 보호 판결",
    court: "대법원 2023. 2. 15. 선고",
    caseNumber: "2021다56789",
    summary: "임대인이 정당한 사유 없이 임차인이 주선한 신규 임차인과의 계약 체결을 거절하여 권리금 회수를 방해한 경우, 손해배상 책임을 폭넓게 인정한 주요 판례.",
    tags: ["민사", "임대차", "손해배상"],
    content: `[사건 개요]
상가 임차인 A씨는 임대차 계약 종료를 앞두고 신규 임차인 B씨를 주선하여 권리금 계약을 체결했습니다. 그러나 임대인 C씨는 건물을 리모델링할 계획이라는 이유로 B씨와의 임대차 계약 체결을 거절했습니다. 이에 A씨는 권리금을 회수하지 못하게 되었다며 C씨를 상대로 손해배상 청구 소송을 제기했습니다.

[쟁점]
임대인이 건물의 리모델링 계획을 이유로 신규 임차인과의 계약 체결을 거절하는 것이 상가건물 임대차보호법상 '정당한 사유'에 해당하는지 여부입니다.

[판결 요지]
대법원은 임차인의 손을 들어주었습니다.
1. 상가임대차법은 임대인이 임차인의 권리금 회수 기회를 방해해서는 안 된다고 규정하고 있다.
2. 건물의 철거 또는 재건축을 위해 점유 회복이 필요한 경우라도, 그것이 법령에 따른 안전진단 결과 등급 미달 등 구체적인 안전사고 우려가 있는 경우가 아니거나, 계약 체결 당시 구체적으로 고지된 계획이 아니라면 정당한 거절 사유가 될 수 없다.
3. 단순히 임대인의 편의나 일반적인 리모델링 계획만으로는 임차인의 권리금 회수 기회를 박탈할 수 없다.

[시사점]
이번 판결은 임대인의 소유권 행사보다 영세 상인의 영업 가치(권리금) 회수 기회를 더 두텁게 보호하려는 법원의 경향을 보여줍니다. 임대인은 정당한 사유 없이 계약 체결을 거절할 경우 거액의 손해배상 책임을 질 수 있음을 유의해야 합니다.`
  },
  {
    id: 3,
    title: "통상임금 소송 신의칙 적용 배제",
    court: "대법원 2022. 11. 20. 선고",
    caseNumber: "2018다98765",
    summary: "기업의 중대한 경영상의 어려움을 이유로 한 신의칙 항변을 엄격하게 해석하여, 근로자의 통상임금 청구를 인용한 전원합의체 판결.",
    tags: ["노동", "임금", "기업법무"],
    content: `[판결의 배경]
정기상여금을 통상임금에 포함시켜 달라는 근로자들의 소송이 잇따르고 있습니다. 이에 대해 기업들은 "추가 수당을 지급하면 경영상 중대한 어려움이 초래된다"며 신의성실의 원칙(신의칙) 위반을 주장해 왔습니다.

[주요 판시 사항]
대법원은 신의칙 적용 요건을 매우 엄격하게 해석했습니다.
1. 근로자의 정당한 권리 행사를 신의칙으로 제한하는 것은 예외적인 경우에 한해야 한다.
2. '중대한 경영상의 어려움'이란 단순히 기업의 수익이 감소하거나 경영 지표가 악화되는 정도를 넘어, 기업의 존립 자체가 위태로울 정도여야 한다.
3. 일시적인 경영 악화나 예측 가능한 범위 내의 재정 부담은 신의칙 적용 사유가 될 수 없다.

[결과]
법원은 해당 기업이 상당한 당기순이익을 기록하고 있고, 이익잉여금을 보유하고 있는 점 등을 들어 기업 측의 신의칙 항변을 배척하고 근로자들의 청구를 인용했습니다. 이는 향후 통상임금 소송에서 기업의 방어 논리가 더욱 좁아질 것임을 시사합니다.`
  },
  {
    id: 4,
    title: "유류분 반환 청구 소송의 소멸시효",
    court: "서울고등법원 2023. 4. 5. 선고",
    caseNumber: "2022나10101",
    summary: "유류분 권리자가 상속의 개시와 반환하여야 할 증여 또는 유증을 안 날로부터 1년의 단기 소멸시효 기산점에 대한 구체적인 판단 기준을 제시한 사례.",
    tags: ["가사", "상속", "유류분"],
    content: `[사안]
피상속인 사망 후 3년이 지난 시점에서 장남이 차남을 상대로 유류분 반환 청구 소송을 제기했습니다. 차남은 "유류분 반환 청구권의 소멸시효인 1년이 지났다"고 항변했습니다. 장남은 "사망 사실은 알았지만, 차남이 생전에 많은 재산을 증여받았다는 사실은 최근에 알았다"고 주장했습니다.

[판결]
법원은 장남의 청구를 인정했습니다.
유류분 반환 청구권의 소멸시효(1년)의 기산점은 '상속의 개시와 반환하여야 할 증여 또는 유증을 안 날'입니다.
단순히 부모님이 돌아가신 날이나, 형제에게 재산이 넘어갔다는 사실을 막연히 안 날이 기준이 아닙니다.
법원은 "해당 증여가 유류분을 침해하여 반환 청구를 할 수 있다는 사실까지 구체적으로 인식한 시점"을 기산점으로 보아야 한다고 판단했습니다.

[주의점]
그러나 소멸시효는 법적 안정성을 위해 존재하므로, 상속 개시 후 10년이 지나면 무조건 청구권이 소멸합니다. 따라서 상속 재산에 대한 의문이 있다면 신속하게 법률 전문가의 도움을 받아 재산 조회를 해보는 것이 좋습니다.`
  },
  {
    id: 5,
    title: "학교폭력 가해학생 징계처분 취소소송",
    court: "서울행정법원 2023. 6. 10. 선고",
    caseNumber: "2022구합8899",
    summary: "학교폭력대책심의위원회의 조치가 재량권을 일탈·남용하였는지 여부가 쟁점이 된 사안에서, 학생의 선도 가능성과 피해 학생의 보호 필요성을 종합적으로 고려한 판결.",
    tags: ["행정", "학교폭력", "소년법"],
    content: `[사건 내용]
고등학생 A군은 동급생에게 언어폭력을 가했다는 이유로 학교폭력대책심의위원회로부터 '전학' 처분을 받았습니다. A군의 부모는 "행위에 비해 처분이 지나치게 가혹하다"며 징계 처분 취소 소송을 제기했습니다.

[법원의 판단]
법원은 전학 처분을 취소하라고 판결했습니다.
1. 학교폭력예방법의 목적은 가해 학생의 처벌보다는 선도와 교육에 있다.
2. A군이 깊이 반성하고 있고, 피해 학생에게 사과 편지를 전달하는 등 관계 회복을 위해 노력한 점이 인정된다.
3. A군의 행위가 지속적이거나 물리적 폭행을 동반한 수준은 아니었다.
4. 전학 조치는 학생의 학습 환경을 근본적으로 바꾸는 중대한 처분이므로, 최후의 수단으로 고려되어야 한다.

이 판결은 학교폭력 처분에 있어 기계적인 기준 적용보다는 구체적인 사안에 따른 비례의 원칙 준수를 강조한 사례입니다.`
  },
  {
    id: 6,
    title: "의료과실 입증책임 완화에 관한 법리",
    court: "대법원 2023. 1. 25. 선고",
    caseNumber: "2021다112233",
    summary: "일반인이 의료 행위의 과실을 입증하기 어려운 점을 고려하여, 의료 행위 과정에서 발생한 악결과에 대해 개연성 이론을 통해 입증 책임을 완화한 사례.",
    tags: ["민사", "의료소송", "손해배상"],
    content: `[핵심 법리]
의료 소송에서 환자 측이 의사의 과실과 악결과 사이의 인과관계를 의학적으로 완벽하게 입증하는 것은 현실적으로 불가능에 가깝습니다. 대법원은 이러한 불균형을 해소하기 위해 입증 책임을 완화하는 법리를 적용하고 있습니다.

[판결 내용]
수술 후 환자에게 심각한 뇌 손상이 발생한 사건에서, 병원 측은 "수술 과정에는 문제가 없었고, 환자의 기저 질환 때문일 가능성이 있다"고 주장했습니다.
그러나 대법원은 다음과 같은 이유로 병원 측의 손해배상 책임을 인정했습니다.
1. 수술 전에는 환자에게 해당 증상이 전혀 없었다.
2. 수술 직후 증상이 발현되었다.
3. 일반적인 합병증의 범위를 벗어난 중대한 결과가 발생했다.
4. 의료진이 다른 원인(기저 질환 등)이 해당 결과를 초래했다는 점을 구체적으로 증명하지 못했다.

즉, 의료 행위상 과실 이외의 다른 원인이 있다고 보기 어려운 간접 사실들이 증명되면, 그 과실과 결과 사이의 인과관계를 추정할 수 있다는 것입니다.`
  }
];

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or default
  const [successCases, setSuccessCases] = useState<SuccessCase[]>(() => {
    const saved = localStorage.getItem('successCases');
    return saved ? JSON.parse(saved) : INITIAL_SUCCESS_CASES;
  });

  const [legalPosts, setLegalPosts] = useState<LegalPost[]>(() => {
    const saved = localStorage.getItem('legalPosts');
    return saved ? JSON.parse(saved) : INITIAL_LEGAL_POSTS;
  });

  const [legalForms, setLegalForms] = useState<LegalForm[]>(() => {
    const saved = localStorage.getItem('legalForms');
    return saved ? JSON.parse(saved) : INITIAL_LEGAL_FORMS;
  });

  const [legalCases, setLegalCases] = useState<LegalCase[]>(() => {
    const saved = localStorage.getItem('legalCases');
    return saved ? JSON.parse(saved) : INITIAL_LEGAL_CASES;
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('successCases', JSON.stringify(successCases)), [successCases]);
  useEffect(() => localStorage.setItem('legalPosts', JSON.stringify(legalPosts)), [legalPosts]);
  useEffect(() => localStorage.setItem('legalForms', JSON.stringify(legalForms)), [legalForms]);
  useEffect(() => localStorage.setItem('legalCases', JSON.stringify(legalCases)), [legalCases]);

  // Generators for ID
  const generateId = (items: { id: number }[]) => items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;

  // CRUD Operations
  const addSuccessCase = (item: Omit<SuccessCase, 'id'>) => setSuccessCases([...successCases, { ...item, id: generateId(successCases) }]);
  const updateSuccessCase = (item: SuccessCase) => setSuccessCases(successCases.map(i => i.id === item.id ? item : i));
  const deleteSuccessCase = (id: number) => setSuccessCases(successCases.filter(i => i.id !== id));

  const addLegalPost = (item: Omit<LegalPost, 'id'>) => setLegalPosts([...legalPosts, { ...item, id: generateId(legalPosts) }]);
  const updateLegalPost = (item: LegalPost) => setLegalPosts(legalPosts.map(i => i.id === item.id ? item : i));
  const deleteLegalPost = (id: number) => setLegalPosts(legalPosts.filter(i => i.id !== id));

  const addLegalForm = (item: Omit<LegalForm, 'id'>) => setLegalForms([...legalForms, { ...item, id: generateId(legalForms) }]);
  const updateLegalForm = (item: LegalForm) => setLegalForms(legalForms.map(i => i.id === item.id ? item : i));
  const deleteLegalForm = (id: number) => setLegalForms(legalForms.filter(i => i.id !== id));

  const addLegalCase = (item: Omit<LegalCase, 'id'>) => setLegalCases([...legalCases, { ...item, id: generateId(legalCases) }]);
  const updateLegalCase = (item: LegalCase) => setLegalCases(legalCases.map(i => i.id === item.id ? item : i));
  const deleteLegalCase = (id: number) => setLegalCases(legalCases.filter(i => i.id !== id));

  return (
    <DataContext.Provider value={{
      successCases, addSuccessCase, updateSuccessCase, deleteSuccessCase,
      legalPosts, addLegalPost, updateLegalPost, deleteLegalPost,
      legalForms, addLegalForm, updateLegalForm, deleteLegalForm,
      legalCases, addLegalCase, updateLegalCase, deleteLegalCase,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};