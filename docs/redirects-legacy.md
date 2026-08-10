# 구 사이트 URL → 새 사이트 301 매핑표

> 대상: 구 sllaw.co.kr(그누보드) 색인 URL → 새 사이트(www.sllaw.co.kr)
> 근거: DOMAIN_LAUNCH_BRIEF A-4
> **이 문서는 사람이 읽는 대장이고, 실제 동작은 [`data/redirects.json`](../data/redirects.json)이 결정한다.**
> 매핑을 바꿀 때는 JSON을 고치고 이 표를 함께 갱신한다.

## 동작 구조

`middleware.ts`가 요청을 받아 순서대로 처리한다.

1. **호스트 정규화** — `*.vercel.app` 요청은 `https://www.sllaw.co.kr`로 308 (경로·쿼리 보존)
2. **게시판 URL** — `/bbs/board.php?bo_table={게시판}&wr_id={글번호}` → 301
   - `wr_id`가 `posts`에 있으면 그 URL로, 없으면 `postDefault`로
   - 등록되지 않은 게시판이면 홈(`/`)으로
3. **정적 페이지** — `/subN_N.php` → 301

그누보드 URL은 쿼리스트링 기반이라 `next.config`의 `redirects()`로는 매핑 테이블 조회가
어렵다. 그래서 미들웨어에서 처리한다.

## 정적 페이지 매핑 (확정)

| 구 URL | 구 페이지 | 새 URL |
|---|---|---|
| `/sub1_1.php` | 형사 | `/practice/criminal-defense` |
| `/sub1_2.php` | 민사일반 | `/practice/civil-litigation` |
| `/sub1_3.php` | 건설부동산 | `/practice` (부동산·건설 두 페이지에 걸쳐 있어 허브로) |
| `/sub1_4.php` | 이혼상속 | `/practice/divorce-inheritance` |
| `/sub1_5.php` | 법인회생 | `/practice` (새 사이트 미취급 분야) |
| `/sub2_1.php` | 법무법인 소개 | `/about` |
| `/sub2_2.php` | 구성원 소개 | `/attorneys/choi-cheolho` |
| `/sub_map.php` | 찾아오시는 길 | `/locations/pyeongtaek` |

## 게시판 매핑 (목록 단위 확정, 개별 글 미확정)

| `bo_table` | 구 게시판 | 건수 | 목록 → | 개별 글 기본값 → |
|---|---|---|---|---|
| `notice` | 법률정보 | 68 | `/insights` | `/insights` |
| `notice2` | 성공사례 | 63 | `/cases` | `/cases` |
| `sub2_3` | 언론보도 | 15 | `/about` | `/about` (대응 페이지 없음) |
| `sub3_1` | 상담 게시판 | 219 | `/consultation` | `/consultation` |
| `partner` | 고객사 | 0 | `/about` | `/about` |

### 개별 글 매핑이 비어 있는 이유

현재 `posts`는 모두 `{}`다. 즉 구 게시판 글은 **전부 목록 페이지로** 떨어진다.
개별 글 URL을 1:1로 연결하려면 구 `wr_id` ↔ 새 slug 대응표가 필요한데, 아직 확보되지
않았다.

개별 매핑을 추가하는 방법:

```jsonc
// data/redirects.json
"notice2": {
  "list": "/cases",
  "postDefault": "/cases",
  "posts": {
    "1234": "/cases/fraud-no-charge",   // wr_id → 새 URL
    "1235": "/cases/dui-acquittal"
  }
}
```

## 대기 중 — Search Console 404 목록

**구 URL 실제 목록은 아직 없다.** 사용자가 Search Console 도메인 속성(B-2)을 등록한 뒤
「페이지」 보고서의 404 목록을 전달하면 이 표와 JSON에 반영한다.

반영 절차:

1. 404 URL 목록 확보 (Search Console 「페이지」 → 색인되지 않음 → 찾을 수 없음(404))
2. 각 URL을 위 표의 규칙에 대응시킨다. 대응 페이지가 없으면 가장 가까운 상위로
3. `data/redirects.json`에 추가 — 정적 경로는 `static`, 게시판 글은 해당 보드의 `posts`
4. 이 문서의 표 갱신
5. 배포 후 대표 URL 몇 개를 실제로 눌러 301 도착지 확인

### 확인이 필요한 것

- 구 사이트의 게시판 URL이 정말 `/bbs/board.php` 형식이었는지 (그누보드 기본값 기준으로
  작성됨). `rewrite`가 걸려 `/notice/1234` 같은 형태였다면 매처를 추가해야 한다.
- 위 `bo_table` 이름과 건수는 이관 당시 인벤토리 기준이다. 실제 색인 URL과 대조 필요.

## 404 페이지

매핑되지 않은 구 URL은 404로 떨어진다. 404 페이지(`app/not-found.tsx`)에는 홈·업무분야·
상담·전화 안내가 있어 방문자가 되돌아갈 경로를 갖는다.
