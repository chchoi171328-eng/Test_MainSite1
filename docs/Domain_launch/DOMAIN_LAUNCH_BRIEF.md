# 정식 도메인 전환 후속 작업 지시서 (www.sllaw.co.kr)

> 2026-08-10 점검 결과: apex→www 리다이렉트 정상, sitemap 존재.
> **긴급 결함 3건**: robots.txt 전체 차단 / canonical이 임시 도메인 / vercel URL
> 미리다이렉트. A(코드 — Claude Code)와 B(계정 — 사용자 직접)로 나눈다.
> A-1~A-4가 최우선 — 이게 풀려야 색인이 시작된다.

---

# A. 코드 작업 (Claude Code)

## A-1. robots.txt 차단 해제 (긴급)

현재 `User-Agent: * / Disallow: /` — 전체 차단 상태다. 교체:

```
User-Agent: *
Allow: /

Sitemap: https://www.sllaw.co.kr/sitemap.xml
```

- 렌더 검증용 더미(가이드 _sample-guide 등)가 노출 경로에 없음을 전제로 전체 허용.
  차단이 필요한 내부 경로가 있으면 그 경로만 Disallow.

## A-2. canonical·절대 URL 전환 (긴급)

- `metadataBase`(또는 동등 설정)를 `https://www.sllaw.co.kr`로 — canonical·OG url이
  전부 새 도메인으로 나가야 한다
- 저장소 전수 검색: `test-main-site1.vercel.app` 하드코딩을 전부 교체
  (JSON-LD url, sitemap 생성 로직, OG, 기타). 교체 내역 보고
- 환경변수(예: `NEXT_PUBLIC_SITE_URL`)로 일원화하고 코드가 이를 참조하게

## A-3. 임시 도메인 리다이렉트 (긴급)

- `test-main-site1.vercel.app` → `https://www.sllaw.co.kr` 경로 보존 308.
  Vercel 프로젝트 도메인 설정에서 primary domain 지정으로 처리(가능하면 설정으로,
  안 되면 middleware). 처리 방법 보고

## A-4. 구 사이트 URL 301 매핑

구 sllaw.co.kr(이전 홈페이지)의 색인된 URL들이 현재 404로 떨어진다.

1. 구 URL 목록 확보: 사용자가 제공하는 목록 우선. 없으면 ①Search Console 등록 후
   색인 페이지·404 보고서 ②`site:sllaw.co.kr` 검색 결과 수집으로 파악
2. `next.config` redirects에 구 URL → 새 페이지 301 매핑
   (구 업무분야 페이지 → /practice/{field}, 구 소개 → /about, 구 오시는길 →
   해당 페이지 등. 대응 페이지가 없으면 가장 가까운 상위로)
3. 매핑표를 파일로 남긴다 (`/docs/redirects-legacy.md`) — 이후 404 로그 보며 추가
4. 404 페이지에 홈·업무분야·전화 안내가 있는지 확인 (없으면 추가)

## A-5. GA4 설치 + 전환 이벤트

- 사용자가 B-1에서 만든 **측정 ID(G-XXXXXXX)**를 환경변수로 받아 gtag 설치
  (app 전역, 페이지뷰 자동)
- 전환 이벤트 3종 (gtag event):
  | 이벤트 | 트리거 |
  |---|---|
  | `call_click` | 전화번호 링크(tel:) 클릭 — 헤더·CTA·모바일 플로팅 버튼 전부 |
  | `consult_submit` | 온라인 상담 폼 제출 성공 |
  | `booking_click` | 상담 예약 버튼 클릭 |
- 이벤트에 `page_location` 자동 포함 확인 (어느 페이지에서 전화했는지가 핵심 데이터)
- 개발 환경에서는 GA 비활성 (측정 ID 없으면 미로드)

## A-6. 마무리 확인

- [ ] robots.txt 전체 허용 + Sitemap 라인
- [ ] 아무 페이지나 소스 보기 → canonical·og:url이 www.sllaw.co.kr
- [ ] vercel URL 접속 → 새 도메인으로 308 (경로 보존)
- [ ] 구 URL 대표 5개 → 301로 새 페이지 도착
- [ ] GA 실시간 보고서에서 페이지뷰·call_click 확인 (사용자와 함께)
- [ ] sitemap.xml 내 전 URL이 새 도메인

---

# B. 계정 작업 (사용자 직접 — 순서대로)

> **진행 기록 (2026-08-10, Claude Code가 사용자 Chrome 세션으로 수행):**
> - **B-1 완료** — GA 계정을 새로 만들지 않고 영문 사이트 GA 계정(Myeong_foreign, 401244447)
>   아래에 속성 「법무법인 명」(549314337)을 추가. 시간대 서울·통화 KRW·업종 사법 및 정부
>   기관·목표 리드 생성+트래픽. 웹 스트림 「법무법인 명 (한글 사이트)」(15411023111),
>   **측정 ID G-EDYWN18WZ3**. Vercel 환경변수 `NEXT_PUBLIC_GA_ID`(Production 전용) 설정
>   후 재배포 — 실사이트 태그 로드·실시간 보고서(call_click 4·booking_click 1) 확인 완료.
> - **B-2 부분 완료** — Search Console에 **URL 접두어** 속성 `https://www.sllaw.co.kr/` 등록.
>   도메인 속성은 가비아 DNS TXT가 필요해 보류(원하면 사용자가 추가). 소유권은 HTML 태그
>   방식(`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env + 재배포)으로 자동 확인. GA 방식은
>   gtag가 afterInteractive 로드라 실패했음. sitemap.xml 제출됨 — 제출 직후 상태
>   "가져올 수 없음"은 GSC 초기 표시로 보이며, **하루 뒤에도 그대로면 재확인 필요**.
>   주요 페이지 URL 검사(색인 요청)는 미실시 — 사용자 몫.
> - **B-5 부분 완료** — 데이터 보존 14개월(이벤트 데이터) 설정, GA↔Search Console 연결 완료.
>   **주요 이벤트 표시는 대기** — call_click 등이 GA 이벤트 목록에 나타나면(최대 24시간)
>   관리→데이터 표시→이벤트에서 별표 3개(call_click·consult_submit·booking_click)를 켤 것.
>   ※ 리드 생성 목표 선택으로 close_convert_lead·qualify_lead가 자동 주요 이벤트로 켜져
>   있음 — 우리 이벤트와 무관하므로 꺼도 됨.
> - B-3(네이버)·B-4(외부 링크)는 사용자 지시로 제외.

## B-1. GA4 계정 생성
analytics.google.com → 계정·속성 생성(속성명: 법무법인 명, 시간대 서울, 통화 KRW)
→ 데이터 스트림(웹, www.sllaw.co.kr) → **측정 ID(G-…)를 Claude Code에 전달** (A-5)

## B-2. Google Search Console
search.google.com/search-console → **도메인 속성**으로 sllaw.co.kr 등록(DNS TXT
확인 — 가비아에서 레코드 추가) → A-1~A-3 배포 확인 후 sitemap.xml 제출 →
주요 페이지(홈·업무분야 8종·수임료) URL 검사로 색인 요청.
※ 좌측 '페이지' 보고서의 404 목록이 A-4 매핑의 소스가 된다 — 목록을 Claude Code에
전달

## B-3. 네이버 서치어드바이저
searchadvisor.naver.com → 사이트 등록(www.sllaw.co.kr, HTML 태그 또는 DNS 확인)
→ 사이트맵 제출 → 웹 페이지 수집 요청. **네이버는 구글과 별개** — 한국 검색의
절반이 여기다

## B-4. 외부 링크 일괄 갱신 (임시 URL·구 사이트 링크가 걸린 곳 전부)
- 구글 비즈니스 프로필 — 웹사이트 URL
- 네이버 플레이스·네이버 지도 / 카카오맵 — 웹사이트 URL
- 네이버 블로그 — 프로필 링크·본문 고정 링크(CTA 배너)
- 영문 사이트(lsfp.co.kr) — 한글 사이트로 거는 링크
- 대한변협·로톡 등 프로필, 명함·인쇄물의 QR/URL (다음 인쇄분부터)

## B-5. GA 기본 설정 (설치 확인 후)
- GA4 ↔ Search Console 연결 (보고서에 검색어 유입 표시)
- A-5의 이벤트 3종을 '주요 이벤트(전환)'로 표시
- 데이터 보존 기간 14개월로 변경 (기본 2개월)

---

# C. 이후 2~4주 모니터링

- Search Console 색인 현황 (색인 페이지 수 증가 추세)
- 404 보고서 → A-4 매핑표에 추가분 반영
- GA: call_click이 어느 페이지에서 발생하는지 — 창끝 전략 검증의 첫 데이터
- 가이드 발행 시작되면: 가이드 URL 색인 여부, 검색 유입 페이지 확인
