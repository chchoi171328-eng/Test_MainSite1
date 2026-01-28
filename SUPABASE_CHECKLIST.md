# ✅ Supabase 설정 완료 체크리스트

이 문서는 Supabase Dashboard에서 실행해야 할 모든 작업을 순서대로 안내합니다.

---

## 📋 빠른 체크리스트

- [ ] **Step 1**: SQL Editor에서 schema.sql 실행
- [ ] **Step 2**: SQL Editor에서 security.sql 실행
- [ ] **Step 3**: Storage 버킷 3개 생성 (judgments, legal-forms, content-images)
- [ ] **Step 4**: Storage 정책 설정
- [ ] **Step 5**: 관리자 계정 생성

**소요 시간**: 약 15-20분

---

## Step 1: 데이터베이스 테이블 생성

### 📂 파일 위치
`supabase/schema.sql`

### 🎯 실행 방법

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택 (wpbamknxfonjfdfzlpya)

2. **SQL Editor 열기**
   - 왼쪽 사이드바 → 🗄️ **SQL Editor** 클릭
   - + **New query** 버튼 클릭

3. **schema.sql 내용 복사**
   - 프로젝트의 `supabase/schema.sql` 파일 전체 복사
   - SQL Editor에 붙여넣기

4. **실행**
   - 오른쪽 하단 **Run** 버튼 클릭 (또는 Ctrl + Enter)
   - "Success" 메시지 확인

### ✅ 확인 사항

왼쪽 사이드바 → **Table Editor**에서 다음 테이블이 생성되었는지 확인:

- ✅ `success_cases` (성공사례) - `image_urls` 필드 포함
- ✅ `legal_posts` (법률정보) - `image_urls` 필드 포함
- ✅ `legal_forms` (법률서식)
- ✅ `legal_cases` (판례) - `image_urls` 필드 포함

---

## Step 2: 보안 정책 설정

### 📂 파일 위치
`supabase/security.sql`

### 🎯 실행 방법

1. **SQL Editor**에서 + **New query** 클릭

2. **security.sql 내용 복사**
   - 프로젝트의 `supabase/security.sql` 파일 전체 복사
   - SQL Editor에 붙여넣기

3. **실행**
   - **Run** 버튼 클릭
   - "Success" 메시지 확인

### ✅ 확인 사항

왼쪽 사이드바 → **Authentication** → **Policies**에서:

각 테이블에 4개의 정책이 있어야 합니다:
- ✅ Enable read access for all users
- ✅ Enable insert for authenticated users only
- ✅ Enable update for authenticated users only
- ✅ Enable delete for authenticated users only

---

## Step 3: Storage 버킷 생성

### 🎯 실행 방법

1. **Storage 메뉴 열기**
   - 왼쪽 사이드바 → 📁 **Storage** 클릭

2. **첫 번째 버킷 생성: judgments**
   - **Create a new bucket** 클릭
   - 설정:
     ```
     Name: judgments
     Public bucket: ✅ (체크)
     File size limit: 50 MB
     Allowed MIME types: (비워두기)
     ```
   - **Save** 클릭

3. **두 번째 버킷 생성: legal-forms**
   - **Create a new bucket** 클릭 다시
   - 설정:
     ```
     Name: legal-forms
     Public bucket: ✅ (체크)
     File size limit: 50 MB
     Allowed MIME types: (비워두기)
     ```
   - **Save** 클릭

4. **세 번째 버킷 생성: content-images**
   - **Create a new bucket** 클릭 다시
   - 설정:
     ```
     Name: content-images
     Public bucket: ✅ (체크)
     File size limit: 10 MB
     Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
     ```
   - **Save** 클릭

### ✅ 확인 사항

Storage 페이지에 3개의 버킷이 보여야 합니다:
- ✅ judgments (Public) - 판결문 파일
- ✅ legal-forms (Public) - 법률 서식
- ✅ content-images (Public) - 게시글 이미지

---

## Step 4: Storage 정책 설정

### 🎯 judgments 버킷 정책

1. **judgments 버킷 클릭**
2. **Policies 탭** 선택
3. **New policy** → **For full customization** 선택

#### Policy 1: Public Read
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'judgments');
```
**Save policy** 클릭

#### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'judgments' AND auth.role() = 'authenticated');
```
**Save policy** 클릭

#### Policy 3: Authenticated Delete
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'judgments' AND auth.role() = 'authenticated');
```
**Save policy** 클릭

### 🎯 legal-forms 버킷 정책

**위와 동일한 3개의 정책을 생성하되, `bucket_id`만 `'legal-forms'`로 변경**

#### Policy 1: Public Read
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'legal-forms');
```

#### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'legal-forms' AND auth.role() = 'authenticated');
```

#### Policy 3: Authenticated Delete
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'legal-forms' AND auth.role() = 'authenticated');
```

### 🎯 content-images 버킷 정책

**위와 동일한 4개의 정책을 생성하되, `bucket_id`만 `'content-images'`로 변경**

#### Policy 1: Public Read
```sql
CREATE POLICY "Public read access for content-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');
```

#### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload content-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'content-images' AND auth.role() = 'authenticated');
```

#### Policy 3: Authenticated Update
```sql
CREATE POLICY "Authenticated users can update content-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');
```

#### Policy 4: Authenticated Delete
```sql
CREATE POLICY "Authenticated users can delete content-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');
```

### ✅ 확인 사항

각 버킷(judgments, legal-forms, content-images)의 Policies 탭에 각각 3-4개의 정책이 있어야 합니다.

---

## Step 5: 관리자 계정 생성

### 🎯 실행 방법

1. **Authentication 메뉴 열기**
   - 왼쪽 사이드바 → 🔐 **Authentication** 클릭

2. **Users 탭** 선택

3. **Add user** 클릭 → **Create new user** 선택

4. **관리자 정보 입력**
   ```
   Email: admin@sllaw.co.kr
   Password: [강력한 비밀번호 입력 - 최소 8자]
   Auto Confirm User: ✅ (체크)
   ```

5. **Create user** 클릭

### ⚠️ 중요
- 이 이메일과 비밀번호는 웹사이트의 관리자 페이지 로그인에 사용됩니다
- **비밀번호를 안전한 곳에 메모**해두세요!

### ✅ 확인 사항

Authentication → Users 페이지에 `admin@sllaw.co.kr` 계정이 보여야 합니다.

---

## 🎉 설정 완료!

모든 단계가 완료되었으면 다음을 진행하세요:

### 1. 개발 서버 실행

```bash
npm run dev
```

### 2. 웹사이트 접속

브라우저에서 http://localhost:3000 접속

### 3. 관리자 페이지 로그인

1. URL에 `#admin` 추가: http://localhost:3000#admin
2. 또는 Footer에서 "관리자" 클릭
3. Step 5에서 생성한 이메일/비밀번호로 로그인

### 4. 데이터 추가

관리자 페이지에서:
- 성공 사례 추가
- 법률 정보 추가
- 판례 추가
- 법률 서식 업로드

---

## 🐛 문제 발생 시

### 에러: "Row Level Security policy violation"

**원인**: RLS 정책이 제대로 설정되지 않음  
**해결**: Step 2의 security.sql을 다시 실행

### 에러: "Storage bucket not found"

**원인**: Storage 버킷이 생성되지 않았거나 이름이 다름  
**해결**: Step 3에서 버킷 이름이 정확히 `judgments`와 `legal-forms`인지 확인

### 파일 업로드 실패

**원인**: Storage 정책이 설정되지 않음  
**해결**: Step 4의 모든 정책을 다시 확인

### 로그인 실패

**원인**: 관리자 계정이 생성되지 않음  
**해결**: Step 5에서 계정이 제대로 생성되었는지 확인

---

## 📞 추가 도움

더 자세한 정보는 다음 파일을 참고하세요:
- `SUPABASE_SETUP.md` - 상세한 설정 가이드
- `README.md` - 프로젝트 전체 문서
