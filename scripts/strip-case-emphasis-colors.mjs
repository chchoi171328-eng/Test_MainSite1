/**
 * 성공사례 본문 강조색 정리 (CASES_LIST_BRIEF 작업 3) — 1회성
 *
 * Quill 이관 본문에 남아 있는 빨간 강조(죄명·처분 등)를 제거한다.
 * 빨강은 전부 <strong style="color: rgb(255,0,0); ...">에 붙어 있으므로
 * color 선언만 지우면 <strong>(검정 굵게)로 남는다 — 지시서가 요구한 형태.
 *
 * - background-color 는 건드리지 않는다 (`(?<!-)color` 로 구분)
 * - 선언 제거 후 빈 style="" 은 속성째 제거
 *
 * 실행: node scripts/strip-case-emphasis-colors.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';

const CASES_DIR = path.join(process.cwd(), 'content', 'cases');
const DRY = process.argv.includes('--dry');

// 팔레트(네이비·골드) 밖 강조색: 빨강 계열
const RED = /(?<!-)color:\s*rgb\(\s*255\s*,\s*0\s*,\s*(?:0|16)\s*\)\s*;?\s*/g;

const report = [];
let totalSpots = 0;

for (const folder of fs.readdirSync(CASES_DIR)) {
  const file = path.join(CASES_DIR, folder, 'index.md');
  if (!fs.existsSync(file)) continue;

  const before = fs.readFileSync(file, 'utf8');
  const hits = (before.match(RED) || []).length;
  if (!hits) continue;

  const after = before
    .replace(RED, '')
    // 선언이 전부 빠져 빈 껍데기만 남은 style 속성 정리
    .replace(/\s*style="\s*"/g, '');

  if (!DRY) fs.writeFileSync(file, after, 'utf8');
  report.push({ slug: folder, spots: hits });
  totalSpots += hits;
}

report.sort((a, b) => b.spots - a.spots || a.slug.localeCompare(b.slug));
for (const r of report) console.log(`${String(r.spots).padStart(3)}  ${r.slug}`);
console.log(`\n${DRY ? '[DRY] ' : ''}빨강 강조 제거: ${totalSpots}곳 / ${report.length}건`);

fs.writeFileSync(
  path.join(process.cwd(), 'scripts', 'strip-case-emphasis-colors-report.json'),
  JSON.stringify({ totalSpots, files: report.length, detail: report }, null, 2),
  'utf8'
);
