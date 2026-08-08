'use client';

import React, { useCallback, useEffect, useState } from 'react';

/**
 * 판결문 문서 카드 + 라이트박스 (CASE_BOARD_BRIEF 작업 4-4)
 *
 * - 데스크톱(>=768px): 클릭 시 페이지 내 오버레이로 표시 (✕·ESC·배경 클릭으로 닫힘)
 * - 모바일(<768px): 오버레이 대신 새 탭 폴백 — 모바일 브라우저의 PDF 인라인 렌더가 불안정
 *
 * 마크업을 항상 <a href>로 두고 데스크톱에서만 preventDefault 하는 구조라
 * (1) SSR/CSR 마크업이 같아 하이드레이션이 안전하고
 * (2) JS가 없으면 새 탭으로 열리는 점진적 향상이 성립한다.
 */
export function JudgmentDocCard({
  url,
  format,
}: {
  url: string;
  format: 'pdf' | 'image';
}) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 새 탭/새 창 의도(수식키·가운데 클릭)는 브라우저에 맡긴다
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    // 오버레이가 떠 있는 동안 배경 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <>
      <a
        className="doc-card"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <div className={format === 'pdf' ? 'ico' : 'ico is-image'} aria-hidden="true" />
        <div className="tx">
          <b>이 사건의 처분 문서</b>
          <span>
            개인정보 마스킹본 · {format === 'pdf' ? 'PDF' : '이미지'} · 클릭하면 화면에서 바로
            열립니다
          </span>
        </div>
        <div className="go" aria-hidden="true">
          →
        </div>
      </a>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex flex-col animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="처분 문서 보기"
          onClick={close}
        >
          <div className="flex items-center justify-between px-5 py-3 text-white/90 shrink-0">
            <span className="text-sm">이 사건의 처분 문서 · 개인정보 마스킹본</span>
            <div className="flex items-center gap-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-white/70 hover:text-white underline underline-offset-2"
              >
                새 탭에서 열기
              </a>
              <button
                type="button"
                onClick={close}
                aria-label="닫기"
                className="text-2xl leading-none text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 이 여백을 클릭하면 닫힌다. 문서 자체(iframe/img)는 전파를 막아 유지된다. */}
          <div className="flex-1 min-h-0 px-4 pb-4">
            {format === 'pdf' ? (
              <iframe
                src={url}
                title="처분 문서"
                className="w-full h-full bg-white rounded-sm"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="w-full h-full overflow-auto bg-white rounded-sm flex items-start justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 마스킹 판결문 스캔 이미지 — 원본 비율 유지 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="처분 문서 (개인정보 마스킹본)" className="max-w-full h-auto" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
