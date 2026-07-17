# 콘텐츠 이관·작성 워크플로우 (지침 14단계)

## 역할 분담

| 역할 | 담당 |
| --- | --- |
| 콘텐츠 초안 작성 (업무분야·지역 페이지 본문, FAQ) | 사용자 + Claude (별도 세션에서 초안 생성 후 변호사 검수) |
| 콘텐츠 데이터 파일화 및 사이트 반영 | Claude Code |
| 구 사이트 게시글 크롤링·정리 | Claude Code (인벤토리 완료 — `legacy-url-inventory.csv`) |
| 법률적 정확성·광고규정 적합성 최종 확인 | 사용자 (변호사) |

Claude Code는 법률 콘텐츠 본문을 창작하지 않는다. 제공된 데이터 파일을 사이트에 반영하는 것까지가 역할이다.

## 업무 분야 콘텐츠 등록 방법

1. `data/templates/practice-area-content-template.ts`를 `data/content/<slug>.ts`로 복사
2. 모든 필드를 변호사 검수를 거친 콘텐츠로 채움
3. `reviewedBy: "최철호 2026-07-15"` 형식으로 검수자·검수일 기입
   — **reviewedBy가 비어 있으면 페이지는 noindex로 유지되고 sitemap에서 제외됨** (자동)
4. `data/practice-areas.ts`의 `CONTENT`에 등록:
   ```typescript
   import { constructionPayment } from './content/construction-payment';
   export const CONTENT = { 'construction-payment': constructionPayment };
   ```
5. 등록 즉시 해당 페이지는 index 허용 + sitemap 포함으로 자동 전환

## 구 사이트 게시글 이관 방법

1. `data/legacy-content-review.md`에서 이관 대상에 O 표시 (선별 기준: 검색 유입·핵심 분야 관련·현행법 부합)
2. 이관 확정 글은 관리자 페이지(/admin)에서 새 글로 등록
   - 제목의 `[평택변호사]` 접두어 등 구형 SEO 관행 정리 (검토 목록에 제안 있음)
   - heading 구조 정리, 작성일 보존, 개정 필요 부분 TODO 표시
   - 성공사례는 변협 광고규정상 과장·일반화 표현 확인
3. 등록된 새 글의 id를 확인하고 `data/redirects.json`의 해당 게시판 `posts`에 추가:
   ```json
   "notice": { "posts": { "64": "/insights/123" } }
   ```
   → 구 URL이 카테고리 허브 대신 새 글로 301 리디렉션됨
4. 이관하지 않는 글은 아무 작업 불필요 (이미 카테고리 허브로 리디렉션됨)

## 서비스 지역 페이지 콘텐츠

`/service-areas/anseong·osan·asan`은 지역별 고유 콘텐츠(관할 법원 안내 등)가 제공될 때까지
noindex 상태. 콘텐츠 제공 시 해당 페이지 구현을 확장하고 noindex를 해제한다.
(지역명만 바꾼 중복 콘텐츠 금지 원칙)

## 신규 콘텐츠 제작 우선순위 (지침 14-3)

```text
1차 (도메인 전환 전 필수) — 완료:
  홈, /about, /attorneys/choi-cheolho, /contact, /consultation,
  /locations/pyeongtaek, /privacy

2차 (핵심 업무 3개):
  /practice/construction-payment   (공사대금)
  /practice/construction-disputes  (건설 분쟁)
  /practice/real-estate-litigation (부동산)

3차: /practice/civil-litigation, /practice/debt-collection
4차: /practice/criminal-defense, /practice/divorce-inheritance
5차 (지속): /service-areas/*, /insights 신규 글 (월 2-4건 목표)
```

## 도메인 전환일 체크리스트 (지침 13-4)

1. [ ] Vercel에 정식 도메인 연결 (`sllaw.co.kr` 또는 지정 도메인)
2. [ ] Vercel 환경변수: `NEXT_PUBLIC_SITE_URL=https://정식도메인`, `NEXT_PUBLIC_ALLOW_INDEXING=true`
3. [ ] http→https, www↔비www 리디렉션이 도메인 레벨에서 1회로 처리되는지 확인 (Vercel 자동 + 도메인 설정)
4. [ ] 주요 구 URL 30개 수동 테스트 (301 + 최종 목적지, `legacy-url-inventory.csv` 참조)
5. [ ] Google Search Console·네이버 서치어드바이저에 인증 후 새 sitemap 제출
   (환경변수: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`)
6. [ ] GSC 주소 변경 도구 사용 (도메인이 변경되는 경우)
7. [ ] 전환 후 4주간 GSC 404 보고서 주 1회 확인 → 누락 리디렉션을 `data/redirects.json`에 추가
