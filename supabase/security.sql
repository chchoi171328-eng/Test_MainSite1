-- ============================================
-- Row Level Security Policies
-- ============================================

-- RLS 활성화
ALTER TABLE success_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;

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
