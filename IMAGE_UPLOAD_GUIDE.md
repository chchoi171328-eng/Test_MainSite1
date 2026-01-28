# 이미지 업로드 기능 추가 안내

법률정보와 판례 게시글에 이미지 업로드 기능이 추가되었습니다.

## 🎨 추가된 기능

### 업데이트된 테이블

| 테이블 | 새 필드 | 타입 | 설명 |
|--------|---------|------|------|
| `legal_posts` | `image_urls` | TEXT[] | 법률정보 게시글 이미지 URLs |
| `legal_cases` | `image_urls` | TEXT[] | 판례 해설 이미지 URLs |

### 새로운 Storage 버킷

**버킷 이름**: `content-images`
- **용도**: 게시글 본문 이미지 저장
- **접근**: Public (모든 사용자 읽기 가능)
- **파일 형식**: JPEG, PNG, GIF, WebP
- **크기 제한**: 10 MB

---

## 📋 Supabase Dashboard 추가 설정

기존 설정에 이어 다음을 추가로 실행하세요:

### Step 1: 테이블 스키마 업데이트

**SQL Editor에서 실행:**

```sql
-- legal_posts 테이블에 image_urls 필드 추가
ALTER TABLE legal_posts 
ADD COLUMN image_urls TEXT[] DEFAULT '{}';

-- legal_cases 테이블에 image_urls 필드 추가
ALTER TABLE legal_cases 
ADD COLUMN image_urls TEXT[] DEFAULT '{}';
```

### Step 2: content-images 버킷 생성

1. **Storage** 메뉴로 이동
2. **Create a new bucket** 클릭
3. 설정:
   ```
   Name: content-images
   Public bucket: ✅
   File size limit: 10 MB
   Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
   ```
4. **Save** 클릭

### Step 3: content-images 버킷 정책 설정

**SQL Editor에서 실행:**

```sql
-- 읽기 권한 (모든 사용자)
CREATE POLICY "Public read access for content-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

-- 업로드 권한 (인증된 사용자만)
CREATE POLICY "Authenticated users can upload content-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'content-images' AND auth.role() = 'authenticated');

-- 수정 권한 (인증된 사용자만)
CREATE POLICY "Authenticated users can update content-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');

-- 삭제 권한 (인증된 사용자만)
CREATE POLICY "Authenticated users can delete content-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');
```

---

## 💡 사용 방법

### 관리자 페이지에서 이미지 업로드

1. **법률정보** 또는 **판례** 섹션에서 게시글 추가/수정
2. 이미지 파일 선택 (JPEG, PNG, GIF, WebP)
3. 이미지는 자동으로 `content-images` 버킷에 업로드
4. 게시글에 이미지 URL 배열로 저장

### 프론트엔드에서 이미지 표시

```typescript
// legal_posts 또는 legal_cases 데이터
const post = {
  id: 1,
  title: "법률정보 제목",
  content: "본문 내용...",
  imageUrls: [
    "https://...supabase.co/storage/v1/object/public/content-images/img1.jpg",
    "https://...supabase.co/storage/v1/object/public/content-images/img2.png"
  ]
};

// 이미지 렌더링
{post.imageUrls?.map((url, index) => (
  <img key={index} src={url} alt={`이미지 ${index + 1}`} />
))}
```

---

## 📊 전체 Storage 버킷 구조

| 번호 | 버킷 이름 | 용도 | 파일 형식 | 크기 제한 |
|------|-----------|------|----------|----------|
| 1 | `judgments` | 성공사례 판결문 | PDF, 이미지 | 50 MB |
| 2 | `legal-forms` | 법률 서식 파일 | HWP, DOCX, PDF | 50 MB |
| 3 | `content-images` | 게시글 이미지 | JPEG, PNG, GIF, WebP | 10 MB |

---

## ✅ 업데이트된 파일

- ✅ `supabase/schema.sql` - 테이블 스키마 업데이트
- ✅ `supabase/storage.sql` - Storage 버킷 및 정책 (새 파일)
- ✅ `types.ts` - LegalPost, LegalCase에 imageUrls 필드 추가
- ✅ `api/legalPosts.ts` - 이미지 URL 처리 로직 추가
- ✅ `api/legalCases.ts` - 이미지 URL 처리 로직 추가

---

## 🎯 다음 단계

1. Supabase Dashboard에서 위의 3단계 실행
2. 관리자 페이지에서 이미지 업로드 기능 테스트
3. 게시글 조회 시 이미지가 정상적으로 표시되는지 확인

**참고 파일**: `supabase/storage.sql`에 전체 버킷 정책이 정리되어 있습니다.
