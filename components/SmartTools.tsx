import React, { useState } from 'react';
import { Calculator, Calendar, ExternalLink, RefreshCw, Baby, Map, Search, Coins, PieChart, Home, Banknote, MessageSquareText, Copy, Check, ClipboardList } from 'lucide-react';

// Comprehensive Court Jurisdiction Data
const COURT_DATA: Record<string, string> = {
  // Seoul
  '종로': '서울중앙지방법원', '중구': '서울중앙지방법원', '강남': '서울중앙지방법원', '서초': '서울중앙지방법원', 
  '관악': '서울중앙지방법원', '동작': '서울중앙지방법원',
  '동대문': '서울북부지방법원', '중랑': '서울북부지방법원', '도봉': '서울북부지방법원', '강북': '서울북부지방법원', '노원': '서울북부지방법원',
  '서대문': '서울서부지방법원', '마포': '서울서부지방법원', '은평': '서울서부지방법원', '용산': '서울서부지방법원',
  '양천': '서울남부지방법원', '강서': '서울남부지방법원', '구로': '서울남부지방법원', '금천': '서울남부지방법원', '영등포': '서울남부지방법원',
  '성동': '서울동부지방법원', '광진': '서울동부지방법원', '강동': '서울동부지방법원', '송파': '서울동부지방법원',

  // Gyeonggi
  '수원': '수원지방법원 (본원)', '화성': '수원지방법원 (본원)', '오산': '수원지방법원 (본원)', '용인': '수원지방법원 (본원)',
  '성남': '수원지방법원 성남지원', '광주(경기)': '수원지방법원 성남지원', '하남': '수원지방법원 성남지원',
  '평택': '수원지방법원 평택지원', '안성': '수원지방법원 평택지원',
  '안산': '수원지방법원 안산지원', '광명': '수원지방법원 안산지원', '시흥': '수원지방법원 안산지원',
  '안양': '수원지방법원 안양지원', '과천': '수원지방법원 안양지원', '의왕': '수원지방법원 안양지원', '군포': '수원지방법원 안양지원',
  '여주': '수원지방법원 여주지원', '이천': '수원지방법원 여주지원', '양평': '수원지방법원 여주지원',
  '의정부': '의정부지방법원 (본원)', '양주': '의정부지방법원 (본원)', '포천': '의정부지방법원 (본원)', '동두천': '의정부지방법원 (본원)', '연천': '의정부지방법원 (본원)',
  '고양': '의정부지방법원 고양지원', '파주': '의정부지방법원 고양지원',
  '남양주': '의정부지방법원 남양주지원', '구리': '의정부지방법원 남양주지원', '가평': '의정부지방법원 남양주지원',

  // Incheon
  '인천': '인천지방법원 (본원)', '부천': '인천지방법원 부천지원', '김포': '인천지방법원 부천지원',

  // Gangwon
  '춘천': '춘천지방법원 (본원)', '화천': '춘천지방법원 (본원)', '양구': '춘천지방법원 (본원)', '인제': '춘천지방법원 (본원)',
  '강릉': '춘천지방법원 강릉지원', '동해': '춘천지방법원 강릉지원', '삼척': '춘천지방법원 강릉지원',
  '원주': '춘천지방법원 원주지원', '횡성': '춘천지방법원 원주지원',
  '속초': '춘천지방법원 속초지원', '고성': '춘천지방법원 속초지원', '양양': '춘천지방법원 속초지원',
  '영월': '춘천지방법원 영월지원', '정선': '춘천지방법원 영월지원', '평창': '춘천지방법원 영월지원', '태백': '춘천지방법원 영월지원', '철원': '의정부지방법원 (본원)',

  // Chungcheong (Daejeon, Sejong, Chungnam, Chungbuk)
  '대전': '대전지방법원 (본원)', '세종': '대전지방법원 (본원)', '금산': '대전지방법원 (본원)',
  '홍성': '대전지방법원 홍성지원', '보령': '대전지방법원 홍성지원', '서천': '대전지방법원 홍성지원', '예산': '대전지방법원 홍성지원',
  '공주': '대전지방법원 공주지원', '청양': '대전지방법원 공주지원',
  '논산': '대전지방법원 논산지원', '부여': '대전지방법원 논산지원', '계룡': '대전지방법원 논산지원',
  '서산': '대전지방법원 서산지원', '태안': '대전지방법원 서산지원', '당진': '대전지방법원 서산지원',
  '천안': '대전지방법원 천안지원', '아산': '대전지방법원 천안지원',
  '청주': '청주지방법원 (본원)', '진천': '청주지방법원 (본원)', '보은': '청주지방법원 (본원)', '괴산': '청주지방법원 (본원)', '증평': '청주지방법원 (본원)',
  '충주': '청주지방법원 충주지원', '음성': '청주지방법원 충주지원',
  '제천': '청주지방법원 제천지원', '단양': '청주지방법원 제천지원',
  '영동': '청주지방법원 영동지원', '옥천': '청주지방법원 영동지원',

  // Daegu/Gyeongbuk
  '대구': '대구지방법원 (본원)', '경산': '대구지방법원 (본원)', '청도': '대구지방법원 (본원)', '칠곡': '대구지방법원 (본원)', '성주': '대구지방법원 (본원)', '고령': '대구지방법원 (본원)',
  '대구서구': '대구지방법원 서부지원', '대구달서': '대구지방법원 서부지원', '대구달성': '대구지방법원 서부지원',
  '안동': '대구지방법원 안동지원', '영주': '대구지방법원 안동지원', '봉화': '대구지방법원 안동지원',
  '경주': '대구지방법원 경주지원',
  '포항': '대구지방법원 포항지원', '울릉': '대구지방법원 포항지원',
  '김천': '대구지방법원 김천지원', '구미': '대구지방법원 김천지원',
  '상주': '대구지방법원 상주지원', '문경': '대구지방법원 상주지원', '예천': '대구지방법원 상주지원',
  '의성': '대구지방법원 의성지원', '군위': '대구지방법원 의성지원', '청송': '대구지방법원 의성지원',
  '영덕': '대구지방법원 영덕지원', '영양': '대구지방법원 영덕지원', '울진': '대구지방법원 영덕지원',

  // Busan/Ulsan/Gyeongnam
  '부산': '부산지방법원 (본원)',
  '울산': '울산지방법원', '양산': '울산지방법원',
  '창원': '창원지방법원 (본원)', 
  '마산': '창원지방법원 마산지원', '함안': '창원지방법원 마산지원', '의령': '창원지방법원 마산지원',
  '진주': '창원지방법원 진주지원', '사천': '창원지방법원 진주지원', '남해': '창원지방법원 진주지원', '하동': '창원지방법원 진주지원', '산청': '창원지방법원 진주지원',
  '통영': '창원지방법원 통영지원', '거제': '창원지방법원 통영지원', '고성(경남)': '창원지방법원 통영지원',
  '밀양': '창원지방법원 밀양지원', '창녕': '창원지방법원 밀양지원',
  '거창': '창원지방법원 거창지원', '합천': '창원지방법원 거창지원', '함양': '창원지방법원 거창지원',

  // Gwangju/Jeonnam
  '광주': '광주지방법원 (본원)', '나주': '광주지방법원 (본원)', '화순': '광주지방법원 (본원)', '장성': '광주지방법원 (본원)', '담양': '광주지방법원 (본원)', '곡성': '광주지방법원 (본원)', '영광': '광주지방법원 (본원)',
  '목포': '광주지방법원 목포지원', '무안': '광주지방법원 목포지원', '신안': '광주지방법원 목포지원', '함평': '광주지방법원 목포지원', '영암': '광주지방법원 목포지원',
  '순천': '광주지방법원 순천지원', '여수': '광주지방법원 순천지원', '광양': '광주지방법원 순천지원', '고흥': '광주지방법원 순천지원', '보성': '광주지방법원 순천지원', '구례': '광주지방법원 순천지원',
  '해남': '광주지방법원 해남지원', '완도': '광주지방법원 해남지원', '진도': '광주지방법원 해남지원', '강진': '광주지방법원 해남지원', '장흥': '광주지방법원 해남지원',

  // Jeonbuk
  '전주': '전주지방법원 (본원)', '김제': '전주지방법원 (본원)', '완주': '전주지방법원 (본원)', '임실': '전주지방법원 (본원)', '진안': '전주지방법원 (본원)', '무주': '전주지방법원 (본원)',
  '군산': '전주지방법원 군산지원', '익산': '전주지방법원 군산지원',
  '정읍': '전주지방법원 정읍지원', '부안': '전주지방법원 정읍지원', '고창': '전주지방법원 정읍지원',
  '남원': '전주지방법원 남원지원', '순창': '전주지방법원 남원지원', '장수': '전주지방법원 남원지원',

  // Jeju
  '제주': '제주지방법원', '서귀포': '제주지방법원',
};

const PROMPT_TEMPLATES = {
  civil: `당신은 10년 경력의 민사 전문 변호사입니다. 현재 저는 [대여금/공사대금/손해배상 등] 문제로 법적 조언이 필요합니다.

1. 상황: [누구에게, 언제, 어떤 피해를 입었는지 구체적으로 육하원칙에 따라 기술]
2. 현재 보유 증거: [차용증, 카카오톡 대화 내용, 이체 내역, 계약서 등]

이 상황에서 제가 취할 수 있는 가장 효과적인 법적 조치(내용증명, 지급명령, 소송 등)의 장단점과 승소 가능성을 높이기 위해 지금 당장 확보해야 할 증거가 무엇인지 단계별로 알려주세요.`,
  criminal: `당신은 형사 전문 변호사입니다. 저는 현재 [사기/폭행/명예훼손 등] 사건의 [피해자/피의자] 입장입니다.

1. 사건 개요: [사건 발생 일시, 장소, 구체적인 경위]
2. 현재 상황: [경찰 신고 전/조사 예정/검찰 송치 등]

Q1. 이 행위가 법적으로 어떤 죄목에 해당하며, 예상되는 처벌 수위는 어느 정도인가요?
Q2. 경찰 조사 과정에서 제가 반드시 유의해야 할 진술 태도나 금기 사항은 무엇인가요?
Q3. [피해자라면] 합의금 산정 기준과 엄벌 탄원서 작성 요령을 알려주세요.
    [피의자라면] 무죄 입증 또는 형량 감경을 위해 필요한 양형 자료는 무엇인가요?`,
  divorce: `당신은 이혼/가사 전문 변호사입니다. 배우자와의 갈등으로 이혼을 심각하게 고려하고 있습니다.

1. 기본 정보: 혼인 기간 [N년], 자녀 [유/무, 나이], 맞벌이 여부
2. 주요 갈등 원인: [성격 차이, 외도, 고부 갈등, 경제적 문제 등 상세 기술]
3. 재산 현황: [대략적인 아파트 시세, 대출금, 예금 등 부부 합산 재산]

Q1. 협의 이혼과 재판상 이혼(소송) 중 저에게 유리한 방식은 무엇이며, 그 이유는 무엇인가요?
Q2. 재산 분할 기여도를 높게 인정받기 위해 제가 지금부터 준비하거나 확보해야 할 자료(금융 거래 내역, 가사 노동 입증 등)는 무엇인가요?
Q3. [유책 배우자인 경우] 제가 유책 배우자임에도 이혼 청구가 가능한가요?
    [상대방 유책인 경우] 상대방의 귀책 사유를 입증하기 위해 합법적으로 수집할 수 있는 증거는 무엇인가요?`
};

const EVIDENCE_GUIDES = {
  civil: `✅ 대여금/손해배상/민사 분쟁 필수 증거

1. 처분문서 (가장 중요)
- 차용증, 약속어음, 각서, 매매계약서 원본
- 원본이 없다면: 은행 계좌 이체 내역 (송금인/수취인/메모란 확인)

2. 의사표시 및 정황 증거
- 문자/카카오톡/이메일: "언제까지 갚을게", "미안해" 등 채무 인정 발언 캡처
- 통화 녹음: 대화 당사자 간의 녹음은 합법 (추후 속기사가 작성한 녹취록 필요)
- 내용증명: 우체국을 통해 발송하고 도달 확인서 보관

3. 기타 보강 증거
- 사실확인서: 당시 상황을 목격한 제3자의 진술서 (인감증명서 또는 신분증 사본 첨부 권장)
- 영수증, 세금계산서, 거래명세서 등`,
  criminal: `✅ 형사 고소/방어 필수 증거 가이드

1. 객관적 자료 확보 (골든타임 중요)
- CCTV 영상: 보관 기간이 보통 2주~1달로 짧음. 경찰 신고 후 즉시 확보 요청하거나 '증거보전신청' 활용
- 진단서: 상해 진단서 (전치 주수 중요), 정신과 진료 기록 (트라우마 입증)
- 112 신고 내역: 사건 발생 직후 신고했다면 정보공개청구로 내역서 확보

2. 디지털 포렌식
- 삭제된 카카오톡, 문자메시지, 사진 복구 (반드시 공인된 업체 이용)
- 차량 블랙박스 영상

3. 사기/경제범죄 특화
- 투자 제안서, 수익 보장 확약서, 팜플렛
- 입출금 거래 내역 (전체 흐름 파악용)
- 상대방의 재력 과시 발언 녹음 또는 캡처`,
  divorce: `✅ 이혼 및 상간 소송 증거 수집

1. 부정행위 입증 (외도)
- 차량 블랙박스: 대화 내용, 숙박업소 진입 영상
- 카드 결제 내역: 모텔, 호텔, 면세점, 백화점 등 (소송 중 법원 사실조회 신청 가능)
- 카카오톡/문자: 애칭, 미래 계획, 성적인 농담 등 (단, 불법 해킹 주의)
- ※ 주의: 도청, 위치추적기 부착 등 불법으로 수집한 증거는 형사 처벌 대상이 될 수 있음

2. 재산분할 대비
- 부동산: 등기부등본, 실거래가 내역, 임대차 계약서
- 금융: 예금, 적금, 보험, 주식 계좌 조회 (최근 1년~3년 치)
- 부채: 부채 증명서 (도박 등 낭비로 인한 빚인지 확인 필요)

3. 자녀 양육
- 양육 일지, 육아 참여 사진/영상, 산모 수첩 등`
};

export const SmartTools: React.FC = () => {
  // Interest Calculator State
  const [principal, setPrincipal] = useState<string>('');
  const [rate, setRate] = useState<string>('5');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [interestResult, setInterestResult] = useState<number | null>(null);

  // Legal Cost (Stamp & Service Fee) Calculator State
  const [legalCostAmount, setLegalCostAmount] = useState<string>('');
  const [isElectronic, setIsElectronic] = useState<boolean>(true);
  const [plaintiffCount, setPlaintiffCount] = useState<string>('1');
  const [defendantCount, setDefendantCount] = useState<string>('1');
  const [stampDutyResult, setStampDutyResult] = useState<number | null>(null);
  const [serviceFeeResult, setServiceFeeResult] = useState<number | null>(null);

  // D-Day Calculator State
  const [targetDate, setTargetDate] = useState<string>('');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  // Child Support Calculator State
  const [csIncome, setCsIncome] = useState<string>('');
  const [csCount, setCsCount] = useState<string>('1');
  const [csAge, setCsAge] = useState<string>('0'); // 0: 0-2세, 1: 3-5세 ... logic index
  const [csResult, setCsResult] = useState<number | null>(null);

  // Court Finder State
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foundCourt, setFoundCourt] = useState<string>('');

  // Inheritance Calculator State
  const [inheritTotal, setInheritTotal] = useState<string>('');
  const [hasSpouse, setHasSpouse] = useState<boolean>(true);
  const [childCount, setChildCount] = useState<string>('2');
  const [inheritResult, setInheritResult] = useState<{spouse: number, child: number} | null>(null);

  // Real Estate Litigation Value (Soga) Calculator State
  const [reValue, setReValue] = useState<string>('');
  const [reCaseType, setReCaseType] = useState<string>('1'); // 1: Ownership, 0.5: Delivery, 0.33: Partition
  const [reResult, setReResult] = useState<number | null>(null);

  // Wage Arrears Calculator State
  const [waIncome, setWaIncome] = useState<string>('');
  const [waUnpaidStart, setWaUnpaidStart] = useState<string>('');
  const [waUnpaidEnd, setWaUnpaidEnd] = useState<string>('');
  const [waIncludeSeverance, setWaIncludeSeverance] = useState<boolean>(false);
  const [waEmpStart, setWaEmpStart] = useState<string>('');
  const [waEmpEnd, setWaEmpEnd] = useState<string>('');
  const [waResult, setWaResult] = useState<{unpaid: number, severance: number} | null>(null);

  // AI Prompt State
  const [promptCategory, setPromptCategory] = useState<'civil' | 'criminal' | 'divorce'>('civil');
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  // Evidence Guide State
  const [evidenceCategory, setEvidenceCategory] = useState<'civil' | 'criminal' | 'divorce'>('civil');
  const [evidenceCopyFeedback, setEvidenceCopyFeedback] = useState<string>('');

  // Helper for formatting number inputs with commas
  const handleFormattedChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue) {
      setter(Number(rawValue).toLocaleString('ko-KR'));
    } else {
      setter('');
    }
  };

  // --- Logic: Interest Calculator ---
  const calculateInterest = () => {
    if (!principal || !rate || !startDate || !endDate) return;
    
    const p = parseFloat(principal.replace(/,/g, ''));
    const r = parseFloat(rate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Simple Interest Formula: Principal * Rate * (Days / 365)
    const interest = Math.floor(p * (r / 100) * (diffDays / 365));
    setInterestResult(interest);
  };

  // --- Logic: Legal Cost Calculator ---
  const calculateLegalCost = () => {
    if (!legalCostAmount) return;
    const amount = parseFloat(legalCostAmount.replace(/,/g, ''));
    
    // 1. Stamp Duty (인지대)
    let stamp = 0;
    if (amount < 10000000) {
      stamp = amount * 0.0050;
    } else if (amount < 100000000) {
      stamp = amount * 0.0045 + 5000;
    } else if (amount < 1000000000) {
      stamp = amount * 0.0040 + 55000;
    } else {
      stamp = amount * 0.0035 + 555000;
    }
    
    // Round to 100 won
    stamp = Math.floor(stamp / 100) * 100;

    // Electronic Filing Discount (10%)
    if (isElectronic) {
      stamp = Math.floor((stamp * 0.9) / 100) * 100;
    }

    // Minimum Stamp Duty
    if (stamp < 1000) stamp = 1000;

    setStampDutyResult(stamp);

    // 2. Service Fee (송달료)
    // Base fee: 5,200 KRW (Standard as of recent updates)
    // Small Claim (< 30M): 10 times per party
    // General Civil: 15 times per party
    const serviceBaseFee = 5200;
    const timesPerParty = amount <= 30000000 ? 10 : 15;
    const parties = (parseInt(plaintiffCount) || 1) + (parseInt(defendantCount) || 1);
    const serviceFee = serviceBaseFee * parties * timesPerParty;

    setServiceFeeResult(serviceFee);
  };

  // --- Logic: D-Day Calculator ---
  const calculateDDay = () => {
    if (!targetDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  };

  // --- Logic: Child Support Calculator (Simplified Approximation based on 2021 Standard) ---
  const calculateChildSupport = () => {
    if (!csIncome) return;
    const income = parseFloat(csIncome.replace(/,/g, '')); // Monthly Combined Income
    const count = parseInt(csCount);
    
    // Base amount per child based on income bracket (Approximate average of age groups)
    let base = 0;
    if (income < 2000000) base = 620000;
    else if (income < 3000000) base = 750000;
    else if (income < 4000000) base = 900000;
    else if (income < 5000000) base = 1050000;
    else if (income < 6000000) base = 1180000;
    else if (income < 7000000) base = 1300000;
    else if (income < 8000000) base = 1430000;
    else if (income < 9000000) base = 1550000;
    else if (income < 10000000) base = 1680000;
    else base = 1900000;

    // Age Weight
    const ageIndex = parseInt(csAge);
    const ageMultiplier = 0.9 + (ageIndex * 0.06); 

    const total = Math.floor(base * ageMultiplier * count);
    setCsResult(total);
  };

  // --- Logic: Inheritance Calculator ---
  const calculateInheritance = () => {
    if (!inheritTotal) return;
    const total = parseFloat(inheritTotal.replace(/,/g, ''));
    const children = parseInt(childCount) || 0;

    let spouseShare = 0;
    let childShare = 0;

    // Spouse Ratio = 1.5, Child Ratio = 1.0
    if (hasSpouse && children === 0) {
        spouseShare = total;
    } else if (!hasSpouse && children > 0) {
        childShare = Math.floor(total / children);
    } else if (hasSpouse && children > 0) {
        const totalRatio = 1.5 + children; // 1.5 for spouse + 1.0 * children
        spouseShare = Math.floor(total * (1.5 / totalRatio));
        childShare = Math.floor(total * (1.0 / totalRatio));
    }

    setInheritResult({ spouse: spouseShare, child: childShare });
  };

  // --- Logic: Real Estate Litigation Value (Soga) Calculator ---
  const calculateReSoga = () => {
    if (!reValue) return;
    const value = parseFloat(reValue.replace(/,/g, '')); // Standard Market Value (시가표준액)
    const multiplier = parseFloat(reCaseType); // 1, 0.5, 0.33...

    // Soga = Value * Multiplier
    const soga = Math.floor(value * multiplier);
    setReResult(soga);
  };

  // --- Logic: Wage Arrears Calculator ---
  const calculateWageArrears = () => {
    if (!waIncome || !waUnpaidStart || !waUnpaidEnd) return;
    const income = parseFloat(waIncome.replace(/,/g, ''));
    
    const uStart = new Date(waUnpaidStart);
    const uEnd = new Date(waUnpaidEnd);
    const uDiff = Math.abs(uEnd.getTime() - uStart.getTime());
    const uDays = Math.ceil(uDiff / (1000 * 60 * 60 * 24)) + 1; // Inclusive

    // Approx daily wage from monthly
    const dailyWage = income / 30; // Labor standards act usually uses 3 months avg / total days, simplified to 30 for estimation
    const unpaidTotal = Math.floor(dailyWage * uDays);

    let severanceTotal = 0;
    if (waIncludeSeverance && waEmpStart && waEmpEnd) {
      const eStart = new Date(waEmpStart);
      const eEnd = new Date(waEmpEnd);
      const eDiff = Math.abs(eEnd.getTime() - eStart.getTime());
      const eDays = Math.ceil(eDiff / (1000 * 60 * 60 * 24));
      
      if (eDays >= 365) {
           // 30 days wage per year
           severanceTotal = Math.floor(income * (eDays / 365));
      }
    }

    setWaResult({ unpaid: unpaidTotal, severance: severanceTotal });
  };

  // --- Logic: Court Finder ---
  const findCourt = (region: string) => {
    if (!region) {
        setFoundCourt('');
        return;
    }
    
    setSelectedRegion(region);
    
    // Direct match
    if (COURT_DATA[region]) {
        setFoundCourt(COURT_DATA[region]);
        return;
    }

    // "Gwangju" disambiguation logic (Basic)
    if (region === '광주') {
         setFoundCourt('광주지방법원 (본원)'); // Default to Metro
         return;
    }

    // Fuzzy Search: Find if any key is contained in the region string, or region is in key
    const matchedKey = Object.keys(COURT_DATA).find(key => region.includes(key));
    
    if (matchedKey) {
         setFoundCourt(COURT_DATA[matchedKey]);
    } else {
         setFoundCourt('해당 지역의 정확한 관할 정보를 찾을 수 없습니다. (시/군/구 명을 정확히 입력해주세요)');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    findCourt(searchQuery);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
  };

  const copyToClipboard = (text: string, setFeedback: (msg: string) => void) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setFeedback('복사되었습니다!');
        setTimeout(() => setFeedback(''), 2000);
      }).catch(err => {
         console.error('Copy failed', err);
         setFeedback('복사 실패 (브라우저 설정 확인)');
         setTimeout(() => setFeedback(''), 2000);
      });
    } else {
       // Fallback for some environments
       setFeedback('복사를 지원하지 않는 브라우저입니다.');
       setTimeout(() => setFeedback(''), 2000);
    }
  };

  return (
    <section id="smart-tools" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Smart Legal Tools</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">스마트 법률 도구</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm md:text-base break-keep">
            복잡한 계산과 조회는 저희에게 맡기세요. <br/>
            의뢰인을 위해 자주 사용되는 법률 계산 도구를 모았습니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Calculators */}
          <div className="space-y-8">
            {/* Tool 1: Legal Interest Calculator */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">법정 이자 계산기</h3>
                  <p className="text-xs text-gray-400">원금과 기간에 따른 지연손해금을 계산합니다.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">원금 (원)</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={principal}
                    onChange={handleFormattedChange(setPrincipal)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    placeholder="예: 10,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">연 이자율 (%)</label>
                  <div className="flex flex-col md:flex-row gap-2">
                    <input 
                      type="number" 
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                      placeholder="예: 5"
                    />
                    <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
                      <button onClick={() => setRate('5')} className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 whitespace-nowrap">민사(5%)</button>
                      <button onClick={() => setRate('6')} className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 whitespace-nowrap">상사(6%)</button>
                      <button onClick={() => setRate('12')} className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 whitespace-nowrap">소촉(12%)</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">시작일</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">종료일</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={calculateInterest}
                  className="w-full py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors mt-4 flex justify-center items-center gap-2"
                >
                  <RefreshCw size={16} /> 계산하기
                </button>

                {interestResult !== null && (
                  <div className="mt-6 p-4 bg-brand-light border border-brand-gold/20 rounded-sm text-center">
                    <p className="text-gray-500 text-sm mb-1">예상 이자액</p>
                    <p className="text-2xl font-bold text-brand-gold font-serif">{formatCurrency(interestResult)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 2: Legal Cost (Stamp & Service Fee) Calculator */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <Coins size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">인지대 · 송달료 계산기</h3>
                  <p className="text-xs text-gray-400">소가에 따른 인지대와 당사자 수에 따른 송달료를 계산합니다.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">소가 (청구금액)</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={legalCostAmount}
                    onChange={handleFormattedChange(setLegalCostAmount)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    placeholder="예: 50,000,000"
                  />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                   <input 
                     type="checkbox" 
                     id="electronicFiling"
                     checked={isElectronic}
                     onChange={(e) => setIsElectronic(e.target.checked)}
                     className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
                   />
                   <label htmlFor="electronicFiling" className="text-sm text-gray-700 cursor-pointer select-none">전자소송 (인지대 10% 할인)</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">원고 (신청인) 수</label>
                        <input 
                            type="number" 
                            min="1"
                            value={plaintiffCount}
                            onChange={(e) => setPlaintiffCount(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">피고 (피신청인) 수</label>
                        <input 
                            type="number" 
                            min="1"
                            value={defendantCount}
                            onChange={(e) => setDefendantCount(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                        />
                    </div>
                </div>

                <button 
                  onClick={calculateLegalCost}
                  className="w-full py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors mt-4 flex justify-center items-center gap-2"
                >
                  <RefreshCw size={16} /> 비용 산출
                </button>

                {(stampDutyResult !== null || serviceFeeResult !== null) && (
                  <div className="mt-6 p-4 bg-brand-light border border-brand-gold/20 rounded-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                         <span className="text-gray-600 text-sm">인지대</span>
                         <span className="font-bold text-brand-dark">{formatCurrency(stampDutyResult || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                         <span className="text-gray-600 text-sm">송달료</span>
                         <span className="font-bold text-brand-dark">{formatCurrency(serviceFeeResult || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                         <span className="text-brand-gold font-bold">총 소송비용</span>
                         <span className="font-bold text-brand-gold text-xl">{formatCurrency((stampDutyResult || 0) + (serviceFeeResult || 0))}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-right">※ 민사 1심 기준이며, 실제 납부 금액과 차이가 있을 수 있습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 3: Child Support Calculator */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <Baby size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">양육비 계산기</h3>
                  <p className="text-xs text-gray-400">부부 합산 소득 기준 예상 양육비를 산정합니다. (2021년 기준)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">부부 합산 월 세전 소득 (원)</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={csIncome}
                    onChange={handleFormattedChange(setCsIncome)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    placeholder="예: 5,000,000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">자녀 수</label>
                        <select 
                            value={csCount}
                            onChange={(e) => setCsCount(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                        >
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}명</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">자녀 평균 나이</label>
                        <select 
                            value={csAge}
                            onChange={(e) => setCsAge(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                        >
                            <option value="0">0~2세</option>
                            <option value="1">3~5세</option>
                            <option value="2">6~11세</option>
                            <option value="3">12~14세</option>
                            <option value="4">15~18세</option>
                        </select>
                    </div>
                </div>

                <button 
                  onClick={calculateChildSupport}
                  className="w-full py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors mt-4 flex justify-center items-center gap-2"
                >
                  <RefreshCw size={16} /> 양육비 산출
                </button>

                {csResult !== null && (
                  <div className="mt-6 p-4 bg-brand-light border border-brand-gold/20 rounded-sm text-center">
                    <p className="text-gray-500 text-sm mb-1">예상 양육비 총액 (월)</p>
                    <p className="text-2xl font-bold text-brand-gold font-serif">{formatCurrency(csResult)}</p>
                    <p className="text-[10px] text-gray-400 mt-2">※ 법원 산정 기준표를 바탕으로 한 단순 참고용 계산입니다. 구체적인 금액은 거주지역, 자녀수 가산 등을 고려하여 달라질 수 있습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 4: Inheritance Share Calculator */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <PieChart size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">상속지분 계산기</h3>
                  <p className="text-xs text-gray-400">법정 상속분에 따른 배우자와 자녀의 예상 상속액을 계산합니다.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">상속 재산 총액 (원)</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={inheritTotal}
                    onChange={handleFormattedChange(setInheritTotal)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    placeholder="예: 1,000,000,000"
                  />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="hasSpouse"
                            checked={hasSpouse}
                            onChange={(e) => setHasSpouse(e.target.checked)}
                            className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
                        />
                        <label htmlFor="hasSpouse" className="text-sm text-gray-700 cursor-pointer select-none">배우자 생존</label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">자녀 수</label>
                    <select 
                        value={childCount}
                        onChange={(e) => setChildCount(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    >
                        <option value="0">없음</option>
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}명</option>)}
                    </select>
                </div>

                <button 
                  onClick={calculateInheritance}
                  className="w-full py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors mt-4 flex justify-center items-center gap-2"
                >
                  <RefreshCw size={16} /> 상속분 계산
                </button>

                {inheritResult && (
                  <div className="mt-6 p-4 bg-brand-light border border-brand-gold/20 rounded-sm space-y-3">
                    {hasSpouse && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                             <span className="text-gray-600 text-sm">배우자 상속분 (1.5)</span>
                             <span className="font-bold text-brand-dark">{formatCurrency(inheritResult.spouse)}</span>
                        </div>
                    )}
                    {parseInt(childCount) > 0 && (
                        <div className="flex justify-between items-center pt-1">
                             <span className="text-gray-600 text-sm">자녀 1인당 상속분 (1.0)</span>
                             <span className="font-bold text-brand-gold text-lg">{formatCurrency(inheritResult.child)}</span>
                        </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-2 text-right">※ 유류분, 기여분 등을 고려하지 않은 민법상 법정 상속분입니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 5: Real Estate Litigation Value (Soga) Calculator - Moved from Right */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <Home size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">부동산 소송 소가 계산</h3>
                  <p className="text-xs text-gray-400">부동산 소송의 목적물 가액(소가)을 산정합니다.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">시가표준액(공시가격) (원)</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    value={reValue}
                    onChange={handleFormattedChange(setReValue)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    placeholder="예: 200,000,000"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">소송 유형</label>
                    <select 
                        value={reCaseType}
                        onChange={(e) => setReCaseType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    >
                        <option value="1">소유권 이전/확인 (100%)</option>
                        <option value="0.5">명도/인도 청구 (50%)</option>
                        <option value="0.33333333">공유물 분할 (33.3%)</option>
                    </select>
                </div>
                
                <button 
                  onClick={calculateReSoga}
                  className="w-full py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors mt-4 flex justify-center items-center gap-2"
                >
                  <RefreshCw size={16} /> 소가 산출
                </button>

                 {reResult !== null && (
                  <div className="mt-6 p-4 bg-brand-light border border-brand-gold/20 rounded-sm text-center">
                    <p className="text-gray-500 text-sm mb-1">산정된 소가</p>
                    <p className="text-2xl font-bold text-brand-gold font-serif">{formatCurrency(reResult)}</p>
                    <p className="text-[10px] text-gray-400 mt-2">※ 시가표준액(공시가격)을 기준으로 한 계산이며, 실제 시세 기준이 아님을 유의하세요.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 6: Wage Arrears Calculator - Moved from Right */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                    <Banknote size={24} />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-brand-dark">체불임금 계산기</h3>
                    <p className="text-xs text-gray-400">미지급 급여와 퇴직금을 포함한 총 체불액을 계산합니다.</p>
                </div>
                </div>

                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">월 평균 급여 (세전/원)</label>
                    <input 
                    type="text" 
                    inputMode="numeric"
                    value={waIncome}
                    onChange={handleFormattedChange(setWaIncome)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                    placeholder="예: 3,000,000"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">체불 기간 (임금 미지급 기간)</label>
                    <div className="flex gap-2 items-center">
                        <input 
                            type="date" 
                            value={waUnpaidStart}
                            onChange={(e) => setWaUnpaidStart(e.target.value)}
                            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold outline-none rounded-sm text-sm"
                        />
                        <span className="text-gray-400">~</span>
                        <input 
                            type="date" 
                            value={waUnpaidEnd}
                            onChange={(e) => setWaUnpaidEnd(e.target.value)}
                            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold outline-none rounded-sm text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <input 
                        type="checkbox" 
                        id="includeSeverance"
                        checked={waIncludeSeverance}
                        onChange={(e) => setWaIncludeSeverance(e.target.checked)}
                        className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold"
                    />
                    <label htmlFor="includeSeverance" className="text-sm text-gray-700 cursor-pointer select-none">퇴직금 포함 (1년 이상 근무 시)</label>
                </div>

                {waIncludeSeverance && (
                    <div className="animate-fade-in bg-gray-50 p-4 rounded-sm border border-gray-100">
                        <label className="block text-sm font-medium text-gray-600 mb-1">총 재직 기간</label>
                        <div className="flex gap-2 items-center">
                            <input 
                                type="date" 
                                value={waEmpStart}
                                onChange={(e) => setWaEmpStart(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 focus:border-brand-gold outline-none rounded-sm text-sm"
                            />
                            <span className="text-gray-400">~</span>
                            <input 
                                type="date" 
                                value={waEmpEnd}
                                onChange={(e) => setWaEmpEnd(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 focus:border-brand-gold outline-none rounded-sm text-sm"
                            />
                        </div>
                    </div>
                )}

                <button 
                    onClick={calculateWageArrears}
                    className="w-full py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors mt-4 flex justify-center items-center gap-2"
                >
                    <RefreshCw size={16} /> 체불액 산출
                </button>

                {waResult && (
                    <div className="mt-6 p-4 bg-brand-light border border-brand-gold/20 rounded-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="text-gray-600 text-sm">미지급 임금</span>
                            <span className="font-bold text-brand-dark">{formatCurrency(waResult.unpaid)}</span>
                    </div>
                    {waIncludeSeverance && (
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <span className="text-gray-600 text-sm">예상 퇴직금</span>
                                <span className="font-bold text-brand-dark">{formatCurrency(waResult.severance)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-1">
                            <span className="text-brand-gold font-bold">총 체불 금액</span>
                            <span className="font-bold text-brand-gold text-xl">{formatCurrency(waResult.unpaid + waResult.severance)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-right">※ 월 급여 기준 단순 계산이며, 수당 및 세금 공제 여부에 따라 실제와 다를 수 있습니다.</p>
                    </div>
                )}
                </div>
            </div>
          </div>

          {/* Right Column: Info & Lookups */}
          <div className="space-y-8">
            {/* Tool: AI Consultation Prompts (New) */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 relative">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <MessageSquareText size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">AI와 초기 상담용 프롬프트</h3>
                  <p className="text-xs text-gray-400">AI 챗봇(ChatGPT 등)에게 질문할 때 사용하기 좋은 최적의 질문 양식입니다.</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                 <button 
                   onClick={() => setPromptCategory('civil')}
                   className={`px-4 py-2 text-sm rounded-sm transition-colors ${promptCategory === 'civil' ? 'bg-brand-gold text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                 >
                   민사
                 </button>
                 <button 
                   onClick={() => setPromptCategory('criminal')}
                   className={`px-4 py-2 text-sm rounded-sm transition-colors ${promptCategory === 'criminal' ? 'bg-brand-gold text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                 >
                   형사
                 </button>
                 <button 
                   onClick={() => setPromptCategory('divorce')}
                   className={`px-4 py-2 text-sm rounded-sm transition-colors ${promptCategory === 'divorce' ? 'bg-brand-gold text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                 >
                   이혼
                 </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 relative group">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans overflow-x-auto custom-scrollbar">
                  {PROMPT_TEMPLATES[promptCategory]}
                </pre>
                <button 
                  onClick={() => copyToClipboard(PROMPT_TEMPLATES[promptCategory], setCopyFeedback)}
                  className="absolute top-2 right-2 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-500 hover:text-brand-dark transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="복사하기"
                >
                  {copyFeedback ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              {copyFeedback && <p className="text-xs text-green-600 mt-2 text-right animate-fade-in">{copyFeedback}</p>}
              
              <p className="text-[10px] text-gray-400 mt-4 leading-normal">
                ※ 위 내용을 복사하여 AI 챗봇에 입력하고, [ ]로 표시된 부분을 구체적인 상황으로 바꿔보세요. 더 정확한 답변을 얻을 수 있습니다.
              </p>
            </div>

            {/* Tool: Evidence Collection Guide (New) */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100 relative">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">증거 수집 가이드</h3>
                  <p className="text-xs text-gray-400">사건 유형별로 반드시 확보해야 할 핵심 증거 리스트입니다.</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                 <button 
                   onClick={() => setEvidenceCategory('civil')}
                   className={`px-4 py-2 text-sm rounded-sm transition-colors ${evidenceCategory === 'civil' ? 'bg-brand-gold text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                 >
                   민사
                 </button>
                 <button 
                   onClick={() => setEvidenceCategory('criminal')}
                   className={`px-4 py-2 text-sm rounded-sm transition-colors ${evidenceCategory === 'criminal' ? 'bg-brand-gold text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                 >
                   형사
                 </button>
                 <button 
                   onClick={() => setEvidenceCategory('divorce')}
                   className={`px-4 py-2 text-sm rounded-sm transition-colors ${evidenceCategory === 'divorce' ? 'bg-brand-gold text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                 >
                   이혼
                 </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 relative group">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans overflow-x-auto custom-scrollbar">
                  {EVIDENCE_GUIDES[evidenceCategory]}
                </pre>
                <button 
                  onClick={() => copyToClipboard(EVIDENCE_GUIDES[evidenceCategory], setEvidenceCopyFeedback)}
                  className="absolute top-2 right-2 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-500 hover:text-brand-dark transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="복사하기"
                >
                  {evidenceCopyFeedback ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              {evidenceCopyFeedback && <p className="text-xs text-green-600 mt-2 text-right animate-fade-in">{evidenceCopyFeedback}</p>}
            </div>

            {/* Tool 5: D-Day Calculator */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">기일 카운터</h3>
                  <p className="text-xs text-gray-400">재판 기일 등 중요한 날짜까지 남은 기간을 확인하세요.</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-600 mb-1">목표 날짜</label>
                  <input 
                    type="date" 
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm"
                  />
                </div>
                <button 
                  onClick={calculateDDay}
                  className="w-full md:w-auto px-6 py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors h-[50px] flex items-center justify-center"
                >
                  확인
                </button>
              </div>

              {daysLeft !== null && (
                <div className="mt-6 text-center">
                  <span className="text-sm text-gray-500">오늘은 목표일까지</span>
                  <div className={`text-4xl font-serif font-bold mt-2 ${daysLeft > 0 ? 'text-brand-dark' : 'text-red-500'}`}>
                    {daysLeft === 0 ? "D-Day" : daysLeft > 0 ? `D-${daysLeft}` : `D+${Math.abs(daysLeft)}`}
                  </div>
                </div>
              )}
            </div>

            {/* Tool 6: Court Finder */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-brand-light p-3 rounded-full text-brand-gold">
                  <Map size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">관할법원 찾기</h3>
                  <p className="text-xs text-gray-400">전국 모든 지역의 관할 법원을 찾아드립니다.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                 <label className="block text-sm font-medium text-gray-600 mb-1">지역 검색 (시/군/구)</label>
                 
                 {/* Search Input */}
                 <form onSubmit={handleSearch} className="relative">
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm pr-12"
                        placeholder="예: 강남구, 평택시, 해운대구"
                    />
                    <button 
                        type="submit"
                        className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-brand-gold transition-colors"
                    >
                        <Search size={20} />
                    </button>
                 </form>

                 <div className="flex items-center gap-2 my-2">
                    <div className="h-px bg-gray-200 flex-grow"></div>
                    <span className="text-xs text-gray-400">또는 목록에서 선택</span>
                    <div className="h-px bg-gray-200 flex-grow"></div>
                 </div>

                 {/* Dropdown with Groups */}
                 <div className="">
                     <select 
                        onChange={(e) => findCourt(e.target.value)}
                        value={selectedRegion}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors rounded-sm text-sm"
                     >
                        <option value="">지역을 선택하세요...</option>
                        <optgroup label="서울">
                            <option value="강남">강남/서초/관악/동작</option>
                            <option value="종로">종로/중구</option>
                            <option value="동대문">동대문/중랑/도봉/노원</option>
                            <option value="서대문">서대문/마포/용산</option>
                            <option value="영등포">영등포/강서/양천/구로</option>
                            <option value="송파">송파/강동/성동/광진</option>
                        </optgroup>
                        <optgroup label="경기 남부">
                            <option value="수원">수원/오산/용인</option>
                            <option value="성남">성남/광주/하남</option>
                            <option value="평택">평택/안성</option>
                            <option value="안산">안산/광명/시흥</option>
                            <option value="안양">안양/군포/의왕/과천</option>
                            <option value="여주">여주/이천/양평</option>
                        </optgroup>
                        <optgroup label="경기 북부/인천">
                            <option value="의정부">의정부/양주/동두천</option>
                            <option value="고양">고양/파주</option>
                            <option value="남양주">남양주/구리/가평</option>
                            <option value="인천">인천</option>
                            <option value="부천">부천/김포</option>
                        </optgroup>
                        <optgroup label="강원">
                            <option value="춘천">춘천/인제/양구</option>
                            <option value="원주">원주/횡성</option>
                            <option value="강릉">강릉/동해/삼척</option>
                            <option value="속초">속초/고성/양양</option>
                        </optgroup>
                        <optgroup label="충청">
                            <option value="대전">대전/세종/금산</option>
                            <option value="천안">천안/아산</option>
                            <option value="청주">청주/진천/괴산</option>
                            <option value="충주">충주/음성</option>
                        </optgroup>
                         <optgroup label="전라">
                            <option value="광주">광주/나주/화순</option>
                            <option value="목포">목포/무안/영암</option>
                            <option value="순천">순천/여수/광양</option>
                            <option value="전주">전주/완주/김제</option>
                            <option value="군산">군산/익산</option>
                        </optgroup>
                        <optgroup label="경상">
                            <option value="부산">부산</option>
                            <option value="울산">울산/양산</option>
                            <option value="창원">창원/김해</option>
                            <option value="진주">진주/사천</option>
                            <option value="대구">대구/경산</option>
                            <option value="포항">포항/울릉</option>
                            <option value="안동">안동/영주</option>
                        </optgroup>
                        <optgroup label="제주">
                            <option value="제주">제주/서귀포</option>
                        </optgroup>
                     </select>
                 </div>

                 {foundCourt && (
                     <div className="mt-6 p-4 bg-brand-dark text-white rounded-sm text-center animate-fade-in">
                        <p className="text-xs text-gray-400 mb-1">관할 법원</p>
                        <p className="text-xl font-bold font-serif">{foundCourt}</p>
                     </div>
                 )}
              </div>
            </div>

            {/* Quick External Links */}
            <div className="bg-brand-dark text-white p-6 md:p-8 rounded-sm shadow-md">
              <h3 className="text-lg md:text-xl font-bold mb-6 font-serif">주요 법률 사이트</h3>
              <div className="space-y-4">
                <a href="https://www.scourt.go.kr/portal/information/events/search/search.jsp" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center group p-3 hover:bg-white/10 rounded-sm transition-colors border border-white/10">
                  <span className="text-sm font-medium">대법원 나의 사건 검색</span>
                  <ExternalLink size={16} className="text-brand-gold" />
                </a>
                <a href="https://ecfs.scourt.go.kr" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center group p-3 hover:bg-white/10 rounded-sm transition-colors border border-white/10">
                  <span className="text-sm font-medium">대한민국 법원 전자소송</span>
                  <ExternalLink size={16} className="text-brand-gold" />
                </a>
                 <a href="https://www.law.go.kr/" target="_blank" rel="noopener noreferrer" className="flex justify-between items-center group p-3 hover:bg-white/10 rounded-sm transition-colors border border-white/10">
                  <span className="text-sm font-medium">국가법령정보센터</span>
                  <ExternalLink size={16} className="text-brand-gold" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};