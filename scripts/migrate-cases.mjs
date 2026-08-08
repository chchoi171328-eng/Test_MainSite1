/**
 * 성공사례 일회성 마이그레이션 (CASE_BOARD_BRIEF 작업 2)
 * Supabase success_cases → /content/cases/{slug}/ + public 미러
 *
 * 실측 데이터가 지시서 전제와 다른 부분 (보고서에 반영):
 * - judgment_url은 Base64가 아니라 Supabase Storage 공개 URL → 다운로드로 복원
 * - 판결문 포맷: PDF 3건 / 이미지(png·jpg) 35건 → 확장자 그대로 저장, 시그니처 검증
 *   (PDF: %PDF / PNG: \x89PNG / JPEG: FF D8)
 * - image_urls(본문 미사용 별도 이미지 5건)도 자산으로 보존 (image-N.*)
 *
 * 실행: node scripts/migrate-cases.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'cases');
const PUBLIC_DIR = path.join(ROOT, 'public', 'content-assets', 'cases');

// ---- env ----
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(ROOT, '.env.local'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !ANON_KEY) {
  console.error('SUPABASE env missing in .env.local');
  process.exit(1);
}

// ---- slug 매핑 (id → slug): title 기반 영문 소문자-하이픈, 중복 -2/-3 ----
const SLUGS = {
  49: 'fraud-no-charge',
  48: 'assault-dismissal',
  47: 'theft-acquittal',
  46: 'defamation-acquittal',
  45: 'voice-phishing-fine',
  44: 'fraud-suspended-sentence',
  43: 'sexual-violence-act-suspended-sentence',
  42: 'fraud-acquittal',
  41: 'dui-acquittal',
  40: 'dui-fine',
  39: 'dangerous-driving-injury-appeal-fine',
  38: 'obstruction-of-official-duties-fine',
  37: 'dangerous-driving-injury-fine',
  36: 'defamation-no-charge',
  35: 'fraud-complaint-imprisonment',
  34: 'manslaughter-suspended-sentence',
  33: 'indecent-assault-no-charge',
  32: 'quasi-rape-no-charge',
  31: 'dui-fine-2',
  30: 'occupational-breach-no-charge',
  29: 'aggravated-rape-no-disposition',
  28: 'abuse-of-authority-indecent-assault-fine',
  27: 'defamation-complaint-fine',
  26: 'occupational-breach-no-charge-2',
  25: 'indecent-assault-no-charge-2',
  24: 'indecent-assault-suspended-indictment',
  23: 'dui-serious-injury-fine',
  22: 'bodily-injury-fine',
  21: 'assault-no-prosecution',
  20: 'unlicensed-dui-suspended-sentence',
  19: 'unlicensed-dui-suspended-sentence-2',
  18: 'embezzlement-fraud-suspended-indictment',
  17: 'indecent-assault-non-indictment',
  16: 'quasi-sexual-act-suspended-sentence',
  15: 'indecent-assault-no-charge-3',
  14: 'dui-suspended-sentence',
  13: 'sexual-violence-act-suspended-sentence-2',
  12: 'quasi-rape-suspended-sentence',
};

// ---- helpers ----
const SIGNATURES = {
  pdf: (buf) => buf.subarray(0, 5).toString('latin1').startsWith('%PDF'),
  png: (buf) => buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47,
  jpg: (buf) => buf[0] === 0xff && buf[1] === 0xd8,
  jpeg: (buf) => buf[0] === 0xff && buf[1] === 0xd8,
};

function extOf(url) {
  const m = url.split('?')[0].match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : '';
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function yamlEscape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// ---- main ----
const rows = await (async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/success_cases?select=*&order=created_at.desc`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } }
  );
  if (!res.ok) throw new Error(`Supabase HTTP ${res.status}: ${await res.text()}`);
  return res.json();
})();

const report = { total: rows.length, ok: [], judgmentFail: [], imageFail: [], listTitles: [] };

for (const row of rows) {
  const slug = SLUGS[row.id];
  if (!slug) {
    console.error(`!! id=${row.id} slug 매핑 없음 — 건너뜀`);
    report.judgmentFail.push({ id: row.id, slug: '(unmapped)', reason: 'slug 매핑 없음' });
    continue;
  }
  const dirC = path.join(CONTENT_DIR, slug);
  const dirP = path.join(PUBLIC_DIR, slug);
  fs.mkdirSync(dirC, { recursive: true });
  fs.mkdirSync(dirP, { recursive: true });

  // 판결문 복원
  let judgmentField = '';
  let judgmentFormat = '';
  let judgmentStatus = 'none';
  if (row.judgment_url) {
    const ext = extOf(row.judgment_url) || (row.judgment_format === 'pdf' ? 'pdf' : 'jpg');
    const fname = `judgment-masked.${ext}`;
    try {
      const buf = await download(row.judgment_url);
      const check = SIGNATURES[ext];
      if (!check) throw new Error(`알 수 없는 확장자 .${ext}`);
      if (!check(buf)) throw new Error(`시그니처 불일치 (.${ext})`);
      fs.writeFileSync(path.join(dirC, fname), buf);
      fs.writeFileSync(path.join(dirP, fname), buf);
      judgmentField = `./${fname}`;
      judgmentFormat = ext === 'pdf' ? 'pdf' : 'image';
      judgmentStatus = `${fname} (${(buf.length / 1024).toFixed(0)}KB)`;
    } catch (e) {
      report.judgmentFail.push({ id: row.id, slug, reason: e.message });
      judgmentStatus = `FAIL: ${e.message}`;
    }
  }

  // 별도 이미지 보존 (렌더 미사용 필드 — 데이터 보존 목적, frontmatter 미기재)
  const imgs = row.image_urls || [];
  for (let i = 0; i < imgs.length; i++) {
    const ext = extOf(imgs[i]) || 'png';
    const fname = `image-${i + 1}.${ext}`;
    try {
      const buf = await download(imgs[i]);
      const check = SIGNATURES[ext];
      if (check && !check(buf)) throw new Error(`시그니처 불일치 (.${ext})`);
      fs.writeFileSync(path.join(dirC, fname), buf);
      fs.writeFileSync(path.join(dirP, fname), buf);
    } catch (e) {
      report.imageFail.push({ id: row.id, slug, file: fname, reason: e.message });
    }
  }

  const date = String(row.created_at).slice(0, 10);
  const fm = [
    '---',
    `title: "${yamlEscape(row.title.trim())}"`,
    `list_title: "${yamlEscape((row.list_title || row.title).trim())}"`,
    `result: "${yamlEscape(row.result)}"`,
    `category: "${yamlEscape(row.category)}"`,
    `date: "${date}"`,
    ...(judgmentField
      ? [`judgment: "${judgmentField}"`, `judgment_format: "${judgmentFormat}"`]
      : []),
    `legacy_id: ${row.id}`,
    '---',
    '',
  ].join('\n');

  // 본문: description HTML 그대로 (재작성 금지)
  fs.writeFileSync(path.join(dirC, 'index.md'), fm + (row.description || '').trim() + '\n');

  report.ok.push({ id: row.id, slug, judgment: judgmentStatus });
  report.listTitles.push({ id: row.id, slug, list_title: row.list_title || `(없음→title) ${row.title.trim()}` });
}

fs.writeFileSync(
  path.join(ROOT, 'scripts', 'migrate-cases-report.json'),
  JSON.stringify(report, null, 2)
);

console.log(`총 ${report.total}건 / 폴더 생성 ${report.ok.length}건 / 판결문 실패 ${report.judgmentFail.length}건 / 이미지 실패 ${report.imageFail.length}건`);
if (report.judgmentFail.length) console.log('판결문 실패:', report.judgmentFail);
if (report.imageFail.length) console.log('이미지 실패:', report.imageFail);
