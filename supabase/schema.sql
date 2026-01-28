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
