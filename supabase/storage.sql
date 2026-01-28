-- ============================================
-- Storage Buckets & Policies Configuration
-- ============================================

-- 이 SQL은 Supabase Dashboard에서 직접 실행하지 않습니다.
-- 참고용 가이드로, Storage 섹션에서 수동으로 버킷을 생성하세요.

-- ============================================
-- 1. judgments 버킷 (성공사례 판결문)
-- ============================================

-- 버킷 생성 (Dashboard에서 수동 생성)
-- Name: judgments
-- Public: true
-- File size limit: 50 MB

-- 정책 설정 (SQL Editor에서 실행)
CREATE POLICY "Public read access for judgments"
ON storage.objects FOR SELECT
USING (bucket_id = 'judgments');

CREATE POLICY "Authenticated users can upload judgments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'judgments' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update judgments"
ON storage.objects FOR UPDATE
USING (bucket_id = 'judgments' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete judgments"
ON storage.objects FOR DELETE
USING (bucket_id = 'judgments' AND auth.role() = 'authenticated');

-- ============================================
-- 2. legal-forms 버킷 (법률서식 파일)
-- ============================================

-- 버킷 생성 (Dashboard에서 수동 생성)
-- Name: legal-forms
-- Public: true
-- File size limit: 50 MB

-- 정책 설정 (SQL Editor에서 실행)
CREATE POLICY "Public read access for legal-forms"
ON storage.objects FOR SELECT
USING (bucket_id = 'legal-forms');

CREATE POLICY "Authenticated users can upload legal-forms"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'legal-forms' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update legal-forms"
ON storage.objects FOR UPDATE
USING (bucket_id = 'legal-forms' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete legal-forms"
ON storage.objects FOR DELETE
USING (bucket_id = 'legal-forms' AND auth.role() = 'authenticated');

-- ============================================
-- 3. content-images 버킷 (게시글 이미지)
-- ============================================

-- 버킷 생성 (Dashboard에서 수동 생성)
-- Name: content-images
-- Public: true
-- File size limit: 10 MB
-- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

-- 정책 설정 (SQL Editor에서 실행)
CREATE POLICY "Public read access for content-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

CREATE POLICY "Authenticated users can upload content-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'content-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update content-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete content-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');
