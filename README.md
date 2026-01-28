# Sol & Luna Law Firm Website

법무법인 명(Sol & Luna Law Firm) 공식 웹사이트

## 📋 프로젝트 개요

React + TypeScript + Vite + Supabase로 구축된 법무법인 웹사이트입니다.

### 주요 기능

- ✅ 법무법인 소개 및 업무 분야 안내
- ✅ 성공 사례 및 판례 검색
- ✅ 법률 정보 및 칼럼
- ✅ 법률 서식 자료실
- ✅ 스마트 법률 도구 (이자 계산기, 소송비용 계산기 등 8가지)
- ✅ 온라인 상담 신청
- ✅ 관리자 CMS (콘텐츠 관리 시스템)

## 🚀 시작하기

### 필수 요구사항

- Node.js (v18 이상)
- Supabase 계정 ([supabase.com](https://supabase.com))
- (선택) EmailJS 계정 ([emailjs.com](https://www.emailjs.com))

### 1. 저장소 클론

```bash
git clone <repository-url>
cd Test_MainSite1
```

### 2. 의존성 설치

```bash
npm install
```

### 3. Supabase 설정

#### 3-1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 이름: `sol-luna-law-firm`
3. 리전: `Northeast Asia (Seoul)`

자세한 설정 방법은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)를 참고하세요.

#### 3-2. 데이터베이스 스키마 생성

Supabase Dashboard → SQL Editor에서 다음 파일들을 순서대로 실행:

1. `supabase/schema.sql` - 테이블 생성
2. `supabase/security.sql` - RLS 보안 정책

#### 3-3. Storage 버킷 생성

Supabase Dashboard → Storage에서 다음 버킷 생성:

- `judgments` (Public) - 판결문 파일 저장
- `legal-forms` (Public) - 법률 서식 파일 저장

#### 3-4. 관리자 계정 생성

Supabase Dashboard → Authentication → Users에서:

- Email: `admin@sllaw.co.kr`
- Password: 강력한 비밀번호 설정
- Auto Confirm User: ✅

### 4. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Configuration
VITE_ADMIN_EMAIL=admin@sllaw.co.kr

# EmailJS Configuration (선택사항)
# VITE_EMAILJS_SERVICE_ID=your_service_id
# VITE_EMAILJS_TEMPLATE_ID=your_template_id
# VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Supabase 정보 가져오기:**
- Supabase Dashboard → Settings → API
- Project URL과 anon public key 복사

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 6. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 📁 프로젝트 구조

```
Test_MainSite1/
├── components/          # React 컴포넌트
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── Admin.tsx       # 관리자 패널
│   └── ...
├── contexts/           # React Context
│   ├── DataContext.tsx # Supabase 데이터 관리
│   └── NavigationContext.tsx
├── api/                # Supabase API 함수
│   ├── successCases.ts
│   ├── legalPosts.ts
│   ├── legalForms.ts
│   └── legalCases.ts
├── lib/                # 유틸리티
│   ├── supabaseClient.ts
│   └── storage.ts      # 파일 업로드/다운로드
├── supabase/           # 데이터베이스 스키마
│   ├── schema.sql
│   └── security.sql
├── types.ts            # TypeScript 타입 정의
└── App.tsx             # 메인 앱
```

## 🔐 관리자 기능

### 관리자 페이지 접속

1. 웹사이트에서 URL 끝에 `#admin` 추가
2. 또는 Footer에서 "관리자" 버튼 클릭
3. Supabase에서 생성한 이메일/비밀번호로 로그인

### 관리 가능한 콘텐츠

- **성공 사례**: 승소 사례 추가/수정/삭제, 판결문 업로드
- **법률 정보**: 법률 칼럼 및 뉴스 관리
- **법률 서식**: 서식 파일 업로드 및 관리
- **판례**: 판례 데이터 관리

## 🛠️ 기술 스택

- **프론트엔드**: React 19, TypeScript 5.8
- **빌드 도구**: Vite 6.2
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase (PostgreSQL)
- **파일 저장소**: Supabase Storage
- **인증**: Supabase Auth
- **아이콘**: Lucide React
- **이메일**: EmailJS

## 📚 추가 문서

- [Supabase 설정 가이드](./SUPABASE_SETUP.md) - 상세한 Supabase 설정 방법
- [구현 계획](./IMPLEMENTATION_PLAN.md) - 전체 구현 계획 및 아키텍처

## 🐛 문제 해결

### Supabase 연결 오류

```
Missing Supabase environment variables
```

**해결방법**: `.env.local` 파일에 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`가 올바르게 설정되었는지 확인

### 데이터가 표시되지 않음

**해결방법**: 
1. Supabase에서 스키마(schema.sql, security.sql)가 실행되었는지 확인
2. RLS 정책이 활성화되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 파일 업로드 실패

**해결방법**: 
1. Storage 버킷(`judgments`, `legal-forms`)이 생성되었는지 확인
2. 버킷이 Public으로 설정되었는지 확인
3. Storage 정책이 올바르게 설정되었는지 확인

## 📝 라이선스

이 프로젝트는 법무법인 명(Sol & Luna Law Firm)의 재산입니다.

## 📞 연락처

- **주소**: 경기도 평택시 평남로 1029-1, SJ프라자 5층
- **전화**: 031-658-6100
- **이메일**: sllaw@sllaw.co.kr
