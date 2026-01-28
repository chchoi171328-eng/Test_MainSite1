# 🚀 Supabase 설정 가이드

이 가이드는 Sol & Luna 법무법인 웹사이트를 위한 Supabase 데이터베이스를 설정하는 방법을 안내합니다.

---

## 📋 목차
1. [Supabase 계정 생성 및 프로젝트 설정](#1-supabase-계정-생성-및-프로젝트-설정)
2. [필요한 정보 가져오기](#2-필요한-정보-가져오기)
3. [데이터베이스 스키마 설정](#3-데이터베이스-스키마-설정)
4. [Storage 버킷 생성](#4-storage-버킷-생성)
5. [보안 정책 (RLS) 설정](#5-보안-정책-rls-설정)
6. [관리자 계정 생성](#6-관리자-계정-생성)
7. [환경 변수 설정](#7-환경-변수-설정)

---

## 1. Supabase 계정 생성 및 프로젝트 설정

### 1-1. Supabase 회원가입

1. **웹브라우저에서 접속**
   ```
   https://supabase.com
   ```

2. **"Start your project" 클릭**
   - 오른쪽 상단의 "Start your project" 버튼 클릭

3. **GitHub 계정으로 로그인** (권장)
   - "Continue with GitHub" 선택
   - 또는 이메일로 가입 가능

### 1-2. 새 프로젝트 생성

1. **"New project" 클릭**
   - Dashboard에서 "New project" 버튼 클릭

2. **Organization 선택**
   - 개인 계정의 경우 자동으로 생성된 organization 선택

3. **프로젝트 정보 입력**
   ```
   Name: sol-luna-law-firm
   Database Password: [강력한 비밀번호 설정]
   Region: Northeast Asia (Seoul) - ap-northeast-2
   Pricing Plan: Free
   ```
   
   > ⚠️ **중요**: Database Password는 반드시 안전한 곳에 메모해두세요!

4. **"Create new project" 클릭**
   - 프로젝트 생성에 약 2-3분 소요됩니다

---

## 2. 필요한 정보 가져오기

### 2-1. Project URL 및 API Keys 확인

프로젝트 생성이 완료되면 다음 정보를 가져와야 합니다:

1. **프로젝트 Dashboard 접속**
   - 생성한 프로젝트 클릭

2. **Settings > API 메뉴로 이동**
   - 왼쪽 사이드바에서 ⚙️ Settings 클릭
   - "API" 탭 선택

3. **필요한 정보 복사**

   #### ✅ Project URL
   ```
   URL: https://[your-project-id].supabase.co
   ```
   - "Project URL" 항목에서 복사

   #### ✅ anon public (공용 API 키)
   ```
   Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - "Project API keys" 섹션
   - "anon public" 키 복사 (오른쪽 복사 버튼 클릭)

   > 📌 **이 키는 프론트엔드에서 사용하며, 공개되어도 안전합니다**
   > (RLS 정책으로 보호됨)

   #### 🔐 service_role (선택사항)
   ```
   Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - "service_role" 키 (필요시)
   - ⚠️ **절대 프론트엔드에 노출하지 마세요!**

---

## 3. 데이터베이스 스키마 설정

### 3-1. SQL Editor 열기

1. **왼쪽 사이드바에서 "SQL Editor" 클릭**
2. **"+ New query" 클릭**

### 3-2. 스키마 실행

아래 SQL을 복사하여 SQL Editor에 붙여넣고 실행하세요:

```sql
-- ============================================
-- Sol & Luna Law Firm Database Schema
-- ============================================

-- 1. 성공사례 테이블
CREATE TABLE success_cases (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  result VARCHAR(100),
  description TEXT,
  judgment_url TEXT,           -- Supabase Storage URL
  judgment_format VARCHAR(20), -- 'pdf' | 'image'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 법률정보 테이블
CREATE TABLE legal_posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  date VARCHAR(50),
  summary TEXT,
  content TEXT,
  image_urls TEXT[],           -- 게시글 이미지 URLs (복수 이미지 지원)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 서식자료 테이블
CREATE TABLE legal_forms (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  format VARCHAR(20),          -- 'HWP' | 'DOCX' | 'PDF'
  size VARCHAR(50),
  file_url TEXT,               -- Supabase Storage URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 판례 테이블
CREATE TABLE legal_cases (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  court VARCHAR(200),
  case_number VARCHAR(100),
  summary TEXT,
  tags TEXT[],                 -- PostgreSQL array
  content TEXT,
  image_urls TEXT[],           -- 게시글 이미지 URLs (복수 이미지 지원)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_success_cases_category ON success_cases(category);
CREATE INDEX idx_legal_posts_category ON legal_posts(category);
CREATE INDEX idx_legal_forms_category ON legal_forms(category);
CREATE INDEX idx_legal_cases_tags ON legal_cases USING GIN(tags);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 설정
CREATE TRIGGER update_success_cases_updated_at BEFORE UPDATE ON success_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_posts_updated_at BEFORE UPDATE ON legal_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_forms_updated_at BEFORE UPDATE ON legal_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_cases_updated_at BEFORE UPDATE ON legal_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**실행 방법:**
1. 위 SQL 전체를 복사
2. SQL Editor에 붙여넣기
3. 오른쪽 하단의 "Run" 버튼 클릭 (또는 Ctrl + Enter)
4. "Success" 메시지 확인

### 3-3. 테이블 생성 확인

1. 왼쪽 사이드바에서 "Table Editor" 클릭
2. 다음 4개 테이블이 생성되었는지 확인:
   - ✅ success_cases
   - ✅ legal_posts
   - ✅ legal_forms
   - ✅ legal_cases

---

## 4. Storage 버킷 생성

파일 업로드를 위한 Storage 버킷을 생성합니다.

### 4-1. Storage 메뉴 접속

1. 왼쪽 사이드바에서 "Storage" 클릭
2. "Create a new bucket" 클릭

### 4-2. 판결문 버킷 생성

```
Name: judgments
Public bucket: ✅ (체크)
File size limit: 50MB
Allowed MIME types: (비워두기)
```

"Save" 클릭

### 4-3. 서식자료 버킷 생성

```
Name: legal-forms
Public bucket: ✅ (체크)
File size limit: 50MB
Allowed MIME types: (비워두기)
```

"Save" 클릭

### 4-4. 콘텐츠 이미지 버킷 생성

```
Name: content-images
Public bucket: ✅ (체크)
File size limit: 10MB
Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
```

"Save" 클릭

### 4-5. 버킷 정책 설정

각 버킷에 대해 다음 정책을 설정합니다:

#### judgments 버킷 정책

1. **judgments 버킷 클릭**
2. **"Policies" 탭 선택**
3. **"New policy" 클릭**
4. **"For full customization" 선택**

**SELECT (읽기) 정책:**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'judgments');
```

**INSERT (업로드) 정책:**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'judgments' AND auth.role() = 'authenticated');
```

**UPDATE (수정) 정책:**
```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'judgments' AND auth.role() = 'authenticated');
```

**DELETE (삭제) 정책:**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'judgments' AND auth.role() = 'authenticated');
```

#### legal-forms 버킷 정책

> 💡 **legal-forms 버킷에도 동일한 4개의 정책을 적용하세요** (bucket_id만 'legal-forms'로 변경)

#### content-images 버킷 정책

> 💡 **content-images 버킷에도 동일한 4개의 정책을 적용하세요** (bucket_id만 'content-images'로 변경)

---

## 5. 보안 정책 (RLS) 설정

Row Level Security를 활성화하여 데이터를 보호합니다.

### 5-1. RLS 활성화

1. "Table Editor" 메뉴로 이동
2. 각 테이블(success_cases, legal_posts, legal_forms, legal_cases)에 대해:
   - 테이블 클릭
   - 오른쪽 상단 "..." 메뉴 클릭
   - "Edit table" 선택
   - "Enable Row Level Security (RLS)" 체크
   - "Save" 클릭

### 5-2. RLS 정책 생성

SQL Editor에서 아래 SQL 실행:

```sql
-- ============================================
-- Row Level Security Policies
-- ============================================

-- 1. success_cases 정책
-- 읽기: 모든 사용자 허용
CREATE POLICY "Enable read access for all users" ON success_cases
  FOR SELECT USING (true);

-- 쓰기: 인증된 사용자만 허용
CREATE POLICY "Enable insert for authenticated users only" ON success_cases
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON success_cases
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON success_cases
  FOR DELETE USING (auth.role() = 'authenticated');

-- 2. legal_posts 정책
CREATE POLICY "Enable read access for all users" ON legal_posts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON legal_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON legal_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON legal_posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- 3. legal_forms 정책
CREATE POLICY "Enable read access for all users" ON legal_forms
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON legal_forms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON legal_forms
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON legal_forms
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. legal_cases 정책
CREATE POLICY "Enable read access for all users" ON legal_cases
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON legal_cases
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON legal_cases
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON legal_cases
  FOR DELETE USING (auth.role() = 'authenticated');
```

---

## 6. 관리자 계정 생성

### 6-1. Authentication 설정

1. **왼쪽 사이드바에서 "Authentication" 클릭**
2. **"Users" 탭 선택**
3. **"Add user" > "Create new user" 클릭**

### 6-2. 관리자 정보 입력

```
Email: admin@sllaw.co.kr
Password: [강력한 비밀번호 입력]
Auto Confirm User: ✅ (체크)
```

"Create user" 클릭

> 📝 **이 이메일과 비밀번호는 관리자 페이지 로그인에 사용됩니다**

---

## 7. 환경 변수 설정

### 7-1. .env.local 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하세요:

```bash
# Supabase 설정
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 관리자 계정 (위에서 생성한 계정)
VITE_ADMIN_EMAIL=admin@sllaw.co.kr
```

**실제 값으로 교체:**
- `[your-project-id]`: Step 2에서 복사한 Project URL
- `eyJhbGciOi...`: Step 2에서 복사한 anon public key

### 7-2. .gitignore 확인

`.env.local` 파일이 Git에 커밋되지 않도록 확인:

```bash
# .gitignore에 다음 라인이 있는지 확인
.env.local
.env*.local
```

---

## 📋 체크리스트

설정이 완료되면 다음을 확인하세요:

- [ ] Supabase 프로젝트 생성 완료
- [ ] Project URL 및 anon key 복사 완료
- [ ] 4개 테이블 생성 확인 (success_cases, legal_posts, legal_forms, legal_cases)
- [ ] legal_posts와 legal_cases 테이블에 image_urls 필드 추가 (기존 테이블인 경우)
- [ ] 3개 Storage 버킷 생성 (judgments, legal-forms, content-images)
- [ ] Storage 정책 설정 완료
- [ ] RLS 활성화 및 정책 적용 완료
- [ ] 관리자 계정 생성 완료
- [ ] .env.local 파일 생성 및 설정 완료

> ⚠️ **기존 테이블이 있는 경우**: ALTER TABLE 명령으로 image_urls 필드를 추가하세요 (IMAGE_UPLOAD_GUIDE.md 참고)

---

## 🎯 다음 단계

설정이 완료되면:

1. **패키지 설치**
   ```bash
   npm install @supabase/supabase-js @emailjs/browser
   ```

2. **코드 업데이트**
   - 기존 LocalStorage 기반 코드를 Supabase API로 전환

3. **테스트**
   - 관리자 로그인 확인
   - 데이터 CRUD 테스트
   - 파일 업로드 테스트

---

## ❓ 문제 해결

### 문제: 테이블이 보이지 않음
**해결:** SQL Editor에서 스키마를 다시 실행하세요.

### 문제: RLS 정책으로 데이터 읽기 실패
**해결:** "Enable read access for all users" 정책이 제대로 생성되었는지 확인하세요.

### 문제: 파일 업로드 실패
**해결:** Storage 버킷이 "Public"으로 설정되었는지, 정책이 올바르게 설정되었는지 확인하세요.

---

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage 가이드](https://supabase.com/docs/guides/storage)
