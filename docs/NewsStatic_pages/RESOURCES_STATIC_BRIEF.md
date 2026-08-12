# 법률 서식·주요 판례 정적 전환 지시서 (Claude Code용)

> 결정: 서식(/legal-forms)과 판례(/legal-cases)를 Supabase에서 **파일 기반(정적)**
> 으로 전환한다 — 성공사례(CASE_BOARD_BRIEF)와 동일한 원리·패턴.
> 근거: 영구 자산 + 서식 파일의 직접 URL(CDN) + 서식 설명글 필드 신설(frontmatter)
> + 발행 파이프라인 통일(스킬 산출 폴더 복사 = 발행).
> 콘텐츠 생산은 legal-precedent-writer / legal-form-writer 스킬이 담당한다.
> **현재 두 페이지의 디자인은 유지한다** — 데이터 소스와 상세 구조만 바꾼다.

## [작업 1] 콘텐츠 구조

```
/content/forms/{slug}/
├── index.md            # frontmatter + 안내글(쓰는 법·주의)
├── form.hwp            # 서식 파일 (있는 형식만)
└── form.docx           # 선택

/content/precedents/{slug}/
└── index.md            # frontmatter + 해설 본문
```

서식 frontmatter:
```yaml
title: "탄원서"                       # 카드 제목 (파일명 아님)
slug: "petition-letter"
field: "criminal"                     # 8분야 키 + common(분야 공통)
summary: "지인·가족이 선처를 요청할 때 법원·검찰에 내는 문서입니다."  # 카드 한 줄
files:
  - path: "./form.hwp"
    format: "HWP"
related: ["settlement"]               # 관련 가이드 slug (발행된 것만 렌더)
updatedAt: "2026-08"
---
(본문: 쓰는 법 요점 불릿 3~5개 + 주의 박스 + 고지)
```

판례 frontmatter:
```yaml
title: "싼 공법 시공 후 공사비 전액 청구 — 편취액은 차액이 아니라 전액"
slug: "construction-fraud-full-amount"
court: "대법원"
decidedAt: "2018-04-12"
caseNumber: "2017도21196"
fields: ["construction", "criminal"]  # 복수 허용
summary: "..."                        # 목록 티저 (사실 요약 — 낚시 문구 금지)
related: ["additional-work-payment"]  # 관련 가이드
---
(본문: 핵심 요약 / 사건의 재구성 / 법원의 판단 / 실무에서의 의미 — 4섹션)
```

## [작업 2] 기존 데이터 마이그레이션

1. **서식**: Supabase의 기존 서식(탄원서·반성문 등)을 폴더로 이관 — 파일은
   실파일로 복원(Storage면 다운로드, Base64면 디코딩 후 파일 시그니처 검증).
   summary·본문은 임시 생성하지 말고 `<!-- TODO: 안내글 — 스킬로 작성 -->` 표시
   (legal-form-writer가 순차 작성).
2. **판례**: 기존 전 건(약 12건)을 본문 그대로 이관. slug는 의미 기반 영문으로
   생성(숫자 ID 금지). **숫자 ID URL → 새 slug 301 리다이렉트** 매핑
   (/legal-cases/12 → /legal-cases/{slug}) — docs/redirects-legacy.md에 기록.
3. 마이그레이션 보고(건수·파일 복원 결과·slug 매핑) → 사용자 확인 후 Supabase
   조회 코드 제거(테이블 보존 — 성공사례와 동일 원칙).

## [작업 3] 페이지 조정 (디자인 유지, 구조 보강)

**서식 목록**: 현행 카드 유지하되 —
- 카드 제목 = frontmatter title (파일명 "탄원서.hwp" 노출 폐지)
- title 아래 summary 한 줄 추가
- 다운로드 버튼은 실파일 직접 URL
- field 필터(8분야+공통) — 사례·가이드와 같은 표시명 매핑 공유

**서식 상세** (신설 — 현재는 목록에서 바로 다운로드만):
- 카드 클릭 → /legal-forms/{slug}: 제목 + summary + 쓰는 법 요점 + 주의 박스 +
  다운로드 버튼 + 관련 가이드 링크. 간단한 1단 구성 (가이드 스타일 계열)
- 하단 고정 고지: "이 서식은 일반적인 상황을 전제로 한 참고용입니다. 구체적
  사안에 따라 내용이 달라질 수 있습니다."
- **법원 공식 양식 안내 섹션**: 목록 하단에 "법원 제출 서식은 법원 공식 양식을
  이용하세요" 블록 + 대한민국법원 전자민원센터 외부 링크 (자체 제작 서식과 구분)

**판례 목록·상세**: 현행 디자인 유지, 데이터 소스만 교체. 상세 하단에
**관련 가이드 링크 블록** 추가(발행된 가이드만 렌더 — 기존 규칙).

## [작업 4] 기존 판례 카피 교정 (마이그레이션과 함께 1회)

- 상세 제목·티저에서 낚시성 표현 제거: 느낌표, "반전", "지금 바로 공개합니다",
  "무려" 류 → 결론형·사실 서술로. 변경 목록 보고
- 섹션 제목의 영문 병기("(Summary)" 등) 제거
- 본문 재작성은 하지 않는다 — 순차 재생산은 legal-precedent-writer 스킬 몫

## [작업 5] 완료 기준

- [ ] 서식·판례가 파일 기반으로 렌더, 기존 디자인 유지
- [ ] 서식 파일이 직접 URL로 다운로드 (Base64 아님), 카드에 title·summary 표시
- [ ] 서식 상세 페이지 동작 (더미 1건으로 검증)
- [ ] 판례 숫자 ID → slug 301 동작, sitemap 갱신
- [ ] 카피 교정 목록 보고, Supabase 조회 코드 제거
- [ ] /legal-info 허브·드롭다운 링크 정상
