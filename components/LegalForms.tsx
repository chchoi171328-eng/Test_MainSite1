'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Search, ExternalLink } from 'lucide-react';
// fs를 쓰는 lib/resources.ts가 아니라 클라이언트 안전한 lib/fields.ts에서 가져온다
import { FORM_FIELDS, FORM_FIELD_LABELS, type FormField } from '../lib/fields';

/** 서버에서 직렬화해 넘기는 카드 데이터 (lib/resources.ts LegalFormItem의 표시용 부분) */
export interface FormCard {
  title: string;
  slug: string;
  field: FormField;
  fieldLabel: string;
  summary: string;
  files: { url: string; format: string; size?: string }[];
}

interface LegalFormsProps {
  forms: FormCard[];
}

/**
 * 법률 서식 목록 (RESOURCES_STATIC_BRIEF 작업 3) — 현행 카드 디자인 유지.
 * 카드 제목 = frontmatter title, summary 한 줄, 다운로드 = 실파일 직접 URL,
 * field 필터(8분야+공통 — 사례·가이드와 같은 표시명 매핑 공유), 카드 클릭 → 상세.
 */
export const LegalForms: React.FC<LegalFormsProps> = ({ forms }) => {
  const [query, setQuery] = useState('');
  const [field, setField] = useState<FormField | null>(null);

  const normalized = query.trim().toLowerCase();
  const filteredForms = forms.filter((form) => {
    if (field && form.field !== field) return false;
    if (!normalized) return true;
    return (
      form.title.toLowerCase().includes(normalized) ||
      form.summary.toLowerCase().includes(normalized) ||
      form.fieldLabel.toLowerCase().includes(normalized)
    );
  });

  // 서식이 있는 분야만 칩 렌더 (빈 분야 자동 숨김 원칙)
  const present = new Set(forms.map((f) => f.field));
  const fieldChips = FORM_FIELDS.filter((f) => present.has(f));

  return (
    <section id="legal-forms" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        {/* 제목·서브 문구는 PageHeader가 담당 */}
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <label htmlFor="form-search" className="sr-only">서식 검색</label>
          <input
            id="form-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="필요한 서식을 검색해보세요 (예: 내용증명)"
            className="w-full px-6 py-4 pl-12 bg-white rounded-sm shadow-sm border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* 분야 필터 칩 */}
        {fieldChips.length > 1 && (
          <div className="cases-filters justify-center" role="tablist" aria-label="분야 필터">
            <button role="tab" aria-selected={!field} onClick={() => setField(null)}>
              전체
            </button>
            {fieldChips.map((f) => (
              <button key={f} role="tab" aria-selected={field === f} onClick={() => setField(f)}>
                {FORM_FIELD_LABELS[f]}
              </button>
            ))}
          </div>
        )}

        {/* Forms Grid */}
        {filteredForms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => {
              const file = form.files[0];
              return (
                <div
                  key={form.slug}
                  className="relative bg-white p-6 rounded-sm border border-gray-200 hover:border-brand-gold/50 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-sm transition-colors ${file ? 'bg-brand-gold text-white' : 'bg-brand-light text-brand-dark'}`}>
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-sm">{form.fieldLabel}</span>
                  </div>
                  {/* 카드 전체 클릭 = 상세 (다운로드 버튼은 위에 겹쳐 개별 동작) */}
                  <Link href={`/legal-forms/${form.slug}`} className="static">
                    <span className="absolute inset-0 z-0" aria-hidden />
                    <h2 className="text-lg font-bold text-brand-dark mb-2 group-hover:text-brand-gold transition-colors">
                      {form.title}
                    </h2>
                  </Link>
                  {form.summary && (
                    <p className="text-sm text-gray-500 leading-relaxed break-keep">{form.summary}</p>
                  )}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {file ? (
                        <>
                          <span className="font-semibold">{file.format}</span>
                          {file.size && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>{file.size}</span>
                            </>
                          )}
                        </>
                      ) : (
                        <span>안내 준비 중</span>
                      )}
                    </div>
                    {file ? (
                      <a
                        href={file.url}
                        download
                        className="relative z-10 flex items-center gap-1 text-sm font-bold text-brand-gold hover:text-brand-dark transition-colors"
                      >
                        <Download size={16} /> 다운로드
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">준비 중</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">검색 결과가 없습니다.</div>
        )}

        {/* 법원 공식 양식 안내 (지시서 작업 3 — 자체 제작 서식과 구분) */}
        <div className="max-w-3xl mx-auto mt-14 border border-gray-200 bg-white rounded-sm p-6 md:p-7">
          <h2 className="font-bold text-brand-dark mb-2">법원 제출 서식은 법원 공식 양식을 이용하세요</h2>
          <p className="text-sm text-gray-600 leading-relaxed break-keep mb-4">
            이 페이지의 서식은 법무법인 명이 실무용으로 정리한 참고 양식입니다. 소장·신청서 등
            법원에 제출하는 서류는 대한민국 법원 전자민원센터의 공식 양식을 확인하시기 바랍니다.
          </p>
          <a
            href="https://help.scourt.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-gold hover:text-brand-dark transition-colors"
          >
            대한민국 법원 전자민원센터 <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
