# 법률정보 게시판 개편 지시서 (Claude Code용)

> 배경: 법률정보를 "흐르는 블로그"에서 **가이드(주제축 영구 문서) + 소식(시간축 발행 글)**
> 이원 체계로 전환한다. 콘텐츠 표준은 `GUIDE_CONTENT_STANDARD.md`, 확정 디자인 예시는
> `guide-sample-myeongdo.html`. 상위 기준: `FIELD_MASTER_PLAN.md`.
> 가이드 글 자체는 별도 스킬(legal-guide-writer)이 MDX 패키지로 생산해 전달한다 —
> 이 지시서는 그 패키지가 꽂힐 **그릇(구조)까지만** 만드는 작업이다.
> **실제 가이드 콘텐츠는 이번 작업에서 발행하지 않는다.** guide-sample-myeongdo.html은
> 디자인·컴포넌트의 시각 정본일 뿐이며, 그 내용(명도소송)은 추후 주택 명도 / 상가
> 명도로 나눠 별도 작성 예정이므로 실제 글로 등록하지 않는다.

---

## [작업 0] 기존 블로그 글 백업 후 전량 제거

1. 현재 법률정보(블로그) 글 전체를 **로컬로 덤프**한다:
   `/docs/archive/blog-dump/` 에 글당 마크다운 1개(제목·본문·작성일·이미지 경로 포함).
   목적은 보존이 아니라 재료 재활용(추후 가이드 작성 시 조사 내용 참조)이다.
2. 덤프 완료 확인 후, 사이트에서 기존 블로그 글·목록·상세 라우트를 제거한다.
3. **리다이렉트는 만들지 않는다.** 현재 벌셀 임시 URL이라 색인 자산이 없다.
4. 블로그가 Supabase 테이블 기반이었다면 관련 조회 코드를 제거한다.
   **성공사례의 Supabase 사용은 그대로 유지한다** — 이번 개편 대상이 아니다.

## [작업 1] 콘텐츠 아키텍처 — MDX 파일 기반 (DB 불사용)

가이드·소식 모두 저장소 파일로 관리한다. 파일 1개 = 글 1편.

```
/content/
├── guides/
│   ├── criminal/
│   ├── criminal-victim/
│   ├── civil/
│   ├── divorce/
│   ├── inheritance/
│   ├── real-estate/
│   │   └── _sample-guide/            # 렌더 검증용 더미 (배포 제외 — 아래 참조)
│   │       ├── index.mdx
│   │       └── thumbnail.jpg
│   ├── construction/
│   └── corporate/
└── news/
    └── 2026-07-something/
        └── index.mdx
```

- 8개 분야 폴더명은 위와 같이 **분야키 그대로** (마스터 플랜 §1과 동일:
  criminal / criminal-victim / civil / divorce / inheritance / real-estate /
  construction / corporate)
- Next.js App Router + `generateStaticParams`로 전량 정적 생성
- 목록·필터·관련 글·세부 페이지 연결은 전부 frontmatter에서 빌드 시 생성

### 가이드 frontmatter (스킬 산출물과 동일 스키마)

```yaml
listingTitle: "명도소송 절차"          # 목록·링크용 짧은 제목
title: "명도소송 절차 — 나가지 않는 임차인, 법으로 내보내는 순서"  # H1·title 태그
slug: "myeongdo-procedure"
field: "real-estate"                  # 8분야 키 중 하나 (필수)
summary: "..."                        # 목록 카드·요약용 1~2문장
metaDescription: "..."
keywords: [...]
reviewedAt: "2026-07"                 # 검토일. publishedAt 필드는 만들지 않는다
author: "최철호"
thumbnail: "./thumbnail.jpg"
related: ["slug-a", "slug-b"]         # 같은 분야 가이드 slug (없으면 [])
tools: ["court-fee-calculator"]       # 연결 스마트 도구 (없으면 [])
```

### 소식 frontmatter

```yaml
title: "..."
slug: "..."
category: "law-change" | "ruling" | "office"   # 법령 개정 / 판례·판결 / 사무소 소식
field: "construction"                 # 선택 — 있으면 해당 분야 가이드·세부 페이지와 연결
publishedAt: "2026-07-24"             # 소식은 발행일을 쓴다 (가이드와 반대)
summary: "..."
---
```

## [작업 2] 라우트

| 경로 | 내용 |
|---|---|
| `/legal-info` | 법률정보 허브 — 가이드 분야별 목록(주), 최근 소식(부) |
| `/guides/{field}` | 분야별 가이드 목록 |
| `/guides/{field}/{slug}` | 가이드 본문 |
| `/news` | 소식 목록 (발행일 역순) |
| `/news/{slug}` | 소식 본문 |

- 가이드 URL에 날짜·번호를 넣지 않는다
- 기존 법률정보 라우트가 위와 다른 경로였다면 새 경로로 교체 (구 경로 리다이렉트 불요 — 작업 0 참조)

## [작업 3] 법률정보 허브 페이지 (/legal-info)

- **가이드가 주인공, 소식은 부속.** 최신순 피드가 아니라 **분야별 묶음**으로 보여준다.
- 구성:
  1. 페이지 헤더 (기존 5안 헤더 표준 유지 — "Legal Guide / 법률정보")
  2. 분야 필터 탭 또는 분야 섹션 8개 — 카드 순서와 동일하게
     (형사 → 형사 피해자 → 민사 → 이혼 → 상속 → 부동산 → 건설 → 기업)
  3. 각 가이드 항목 표시: **listingTitle** + summary 1줄 + 검토일("2026년 7월 확인")
     — 날짜를 크게 쓰지 않는다. 검토일은 보조 정보다
  4. 하단 "최근 소식" 3~5건 (발행일 표기) + 소식 전체 보기 링크
- 글이 없는 분야는 섹션 자체를 숨긴다 (성공사례의 자동 숨김과 같은 원칙)

## [작업 4] 가이드 본문 페이지 (/guides/{field}/{slug})

**디자인·구성의 정본은 `guide-sample-myeongdo.html`이다.** 저장소 /docs/previews/에
배치하고 그대로 재현한다. 필요한 MDX 컴포넌트:

| 컴포넌트 | 역할 | 예시 파일의 대응 요소 |
|---|---|---|
| `<GuideSummary>` | 요약 박스 (골드 좌측 보더) | .summary |
| `<GuideToc />` | 목차 — H2에서 자동 생성, 영문 앵커 | .toc |
| `<Term>` | 용어 풀이 (작은 회색 문장) | .term |
| `<Caption>` | 이미지 캡션 (정보형) | figcaption |
| `<Callout>` | 경고·주의 박스 (노란 계열) | .callout |
| `<GuideFlow>` | 절차 도식 (번호 스텝, HTML) | .flow |
| `<GuideDeadline>` | 기한 박스 (다크 배경) | .deadline |
| `<GuideFaq>` / `<Q>` / `<A>` | FAQ 아코디언 | .faq |
| `<LegalDisclaimer />` | 법률 정보 안내 고정 문구 | .disc |
| `<GuideRelated />` | 함께 보면 좋은 자료 — related·tools·field에서 자동 생성 | .related |
| `<BrandCta topic=".." what=".." />` | 브랜드 앵커 CTA 고정 블록 | .cta |
| `<GuideMeta />` | 푸터 메타 — author·reviewedAt에서 생성 | .fmeta |

렌더 검증용 더미:
- 컴포넌트·레이아웃 검증을 위해 `_sample-guide` 폴더에 **더미 MDX 1편**을 만든다.
  내용은 guide-sample-myeongdo.html의 구성 요소를 재현하되, 제목·본문은
  "샘플 가이드 — 렌더 검증용" 류의 더미 텍스트로 채운다 (실제 법률 내용 사용 금지).
- 언더스코어 prefix(`_sample-guide`)는 **빌드에서 제외**한다 — 목록·sitemap·세부
  페이지 §9 어디에도 노출되지 않아야 한다. 로컬/프리뷰에서만 렌더 확인 용도.
- 검증 완료 후에도 폴더는 남겨둔다 (추후 신규 가이드 반영 시 참조 템플릿).

주의사항:
- **목차 앵커 = 헤딩 자동 ID.** MDX 렌더러의 heading id 생성 방식(rehype-slug 등)과
  GuideToc의 앵커가 반드시 일치해야 한다. 한글 헤딩이므로 명시적 영문 id
  (`{#check-termination}`)를 지원하도록 설정한다.
- `<GuideRelated />`는 ① 해당 field의 세부 페이지(/practice/{field}) — **항상 첫
  항목** ② related slug의 가이드들(listingTitle로 표시) ③ tools의 스마트 도구 순.
- `<GuideMeta />` 문구는 예시 파일 그대로: "작성 · 최철호 변호사 (법무법인 명,
  대한변호사협회 등록 형사법·민사법 전문변호사)" + "검토 · {YYYY}년 {M}월 기준으로
  내용을 확인했습니다. 법령·판례 변경 시 갱신합니다." **발행일 표기 금지.**
- 상단 breadcrumb: 법률정보 › {분야 표시명} › {listingTitle 축약}

## [작업 5] 업무 분야 세부 페이지 §9 자동 연결

각 세부 페이지(/practice/{field})의 「직접 확인해보실 수 있는 것들」 섹션을
하드코딩 목록에서 **빌드 시 자동 생성**으로 교체한다:

- 소스: `field`가 일치하는 가이드의 listingTitle (최대 4건) + 해당 분야에 연결된
  스마트 도구
- 표시 형식은 현행 유지 (제목 + 태그 「법률정보」/「스마트 도구」)
- 해당 분야 가이드가 0건이면 현행 placeholder 유지 또는 섹션 축소 — 깨진 링크 금지
- 노출 우선순위: 가이드 frontmatter에 `featured: true`가 있으면 우선, 없으면
  reviewedAt 최신순

## [작업 6] 소식 게시판 (/news)

- 발행일 역순 목록. 카테고리 뱃지(법령 개정 / 판례·판결 / 사무소 소식)
- 본문 페이지는 가이드보다 단순한 레이아웃 (요약박스·목차·기한박스 불요)
- `field`가 지정된 소식은 본문 하단에 해당 분야 세부 페이지·가이드 링크 표시
- 소식은 발행일을 명확히 표기한다 — 가이드와 반대라는 점이 의도다

## [작업 7] 상단 메뉴

- "법률정보" 메뉴 → /legal-info
- 드롭다운(선택): 분야별 가이드 8항목 + (구분선) 소식 — 업무 분야 드롭다운과
  동일한 패턴. 구현 부담이 크면 1차에서는 드롭다운 없이 /legal-info 단일 링크로

## [작업 8] SEO

1. 가이드 페이지 title: `{title} | 법무법인 명`
2. FAQ 섹션에 **FAQPage JSON-LD** 자동 생성 (GuideFaq 데이터에서)
3. 가이드에 Article JSON-LD: author(최철호), dateModified = reviewedAt.
   **datePublished는 넣지 않는다** (없는 데이터를 만들지 않는다)
4. sitemap.xml에 가이드·소식 전 경로 포함, lastmod = reviewedAt/publishedAt
5. OG 이미지 = thumbnail
6. 이미지 alt는 frontmatter가 아니라 MDX 본문의 마크다운 alt를 그대로 사용

## [작업 9] 완료 기준

- [ ] 기존 블로그 글 덤프 파일 존재 확인 후 라우트·데이터 제거됨
- [ ] /content/guides/{8분야}/ 구조 생성, 더미 가이드(_sample-guide)가 로컬에서 렌더됨
- [ ] 더미 가이드 본문이 guide-sample-myeongdo.html과 시각적으로 일치
- [ ] 목차 앵커 클릭 시 해당 H2로 이동 (모바일 포함)
- [ ] /legal-info가 분야별 묶음 구조로 동작 — 현재 전 분야 0건 상태의 빈 화면 처리가 자연스러움 (안내 문구 등)
- [ ] 세부 페이지 §9 자동 연결 로직 구현됨 — 현재 실제 가이드가 0건이므로 전 분야
      placeholder/축소 상태로 정상 동작하고, 더미(_sample-guide)가 노출되지 않음
- [ ] 가이드에 발행일이 어디에도 표시되지 않음 (검토일만)
- [ ] 소식 목록·본문이 발행일과 함께 동작
- [ ] FAQPage·Article JSON-LD가 유효 (Rich Results Test 통과 수준)
- [ ] sitemap에 신규 경로 반영

## 참고 (이번 작업 아님)

- 네이버 블로그·구 사이트(sllaw.co.kr)의 기존 글 → 새 가이드 매핑은 **정식 도메인
  전환 시** 별도 작업으로 진행한다 (그쪽은 실제 색인 자산이 있어 리다이렉트 필요).
- 가이드 원고 생산은 legal-guide-writer 스킬 담당. 이 구조가 완성되면 스킬 산출물
  (output/{field}/{slug}/ 폴더)을 /content/guides/에 그대로 복사하는 것이 반영 절차가 된다.
- 첫 실제 가이드는 **주택 명도 / 상가 명도 2편으로 분리 작성** 예정 (사용자가 스킬로
  별도 생산). 이번 작업에서는 어떤 실제 가이드도 만들지 않는다.
