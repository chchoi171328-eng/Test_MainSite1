'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, Loader2, AlertTriangle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

const CATEGORIES = ['형사 변호', '민사 소송', '가사 / 상속', '부동산 / 건설', '기업 법무', '기타'];
const METHODS = ['방문 상담', '전화 상담'];
const TIMES = ['평일 오전', '평일 오후', '주말(예약제)', '무관'];

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  category: '형사 변호',
  method: '방문 상담',
  availableTime: '무관',
  content: '',
  website: '', // honeypot — 사람에게 보이지 않음
};

export const Consultation: React.FC = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  // 상담 양식 시작 이벤트 — 첫 입력 시 1회만 (지침 12단계)
  const handleFormStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent('consultation_start');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // 숫자만 추출
      const numbers = value.replace(/[^0-9]/g, '');
      let formatted = numbers;

      // 서울 지역번호(02)인 경우와 그 외(010 등) 구분하여 포맷팅
      if (numbers.startsWith('02')) {
        if (numbers.length <= 2) {
          formatted = numbers;
        } else if (numbers.length <= 5) {
          formatted = `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
        } else if (numbers.length <= 9) {
          formatted = `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
        } else {
          formatted = `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
        }
      } else {
        if (numbers.length <= 3) {
          formatted = numbers;
        } else if (numbers.length <= 7) {
          formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
          formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
        }
      }

      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, privacyAgreed }),
      });

      const result = await response.json().catch(() => ({ ok: false }));

      if (response.ok && result.ok) {
        trackEvent('consultation_submit_success', { category: formData.category });
        setSubmitStatus('sent');
        setFormData(INITIAL_FORM);
        setPrivacyAgreed(false);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Consultation submit error:', error);
      setSubmitStatus('error');
      setErrorMessage('전송 중 오류가 발생했습니다. 잠시 후 다시 시도하시거나 031-658-6100으로 전화 주시기 바랍니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors text-brand-dark placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400';

  return (
    <section className="py-20 md:py-32 bg-white flex justify-center items-center min-h-[80vh]">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-brand-dark mb-4">온라인 상담 신청</h1>
          <div className="w-16 h-1 bg-brand-gold"></div>
        </div>

        <div className="relative h-52 md:h-80 mb-10 overflow-hidden rounded-sm">
          <Image
            src="/assets/brand/consult-chairs.webp"
            alt="법무법인 명 상담실의 좌석"
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        <div className="bg-white p-0 md:p-8">
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            사소한 질문이라도 괜찮습니다. 부끄러우실 일이 아닙니다.<br />
            상담 후 의뢰하지 않으셔도 됩니다. 먼저 상황을 정확히 아는 것이 시작입니다.
          </p>

          {/* 필수 안내 (지침 8단계) */}
          <div className="mb-10 border border-gray-200 bg-gray-50 p-5 rounded-sm text-sm text-gray-600 space-y-2 leading-relaxed break-keep">
            <p>· 초기 상담은 유료입니다. 상담료는 30분당 5만 원이며, 정확한 안내는 접수 후 연락드릴 때 함께 드립니다.</p>
            <p>· 상담 신청 접수만으로 위임계약이 성립하지 않습니다. 사건 수임은 상담 후 별도의 위임계약으로 진행됩니다.</p>
            <p className="flex items-start gap-2 text-red-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>주민등록번호, 계좌 비밀번호 등 민감한 개인정보나 증거 원본 내용은 입력하지 마세요. 자세한 내용은 상담 시 안전하게 전달하실 수 있습니다.</span>
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit} onFocus={handleFormStart}>
            {/* Honeypot — 봇 차단용, 화면·스크린리더 모두에서 숨김 */}
            <div className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
              <label>
                웹사이트 (입력하지 마세요)
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="consult-name" className="block text-sm font-medium text-gray-600 mb-2">이름 <span className="text-red-500">*</span></label>
                <input
                  id="consult-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  disabled={isSubmitting}
                  className={inputClass}
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label htmlFor="consult-phone" className="block text-sm font-medium text-gray-600 mb-2">연락처 <span className="text-red-500">*</span></label>
                <input
                  id="consult-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={13}
                  title="010-0000-0000 형식으로 입력해주세요."
                  disabled={isSubmitting}
                  className={inputClass}
                  placeholder="숫자만 입력 (예: 01012345678)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="consult-email" className="block text-sm font-medium text-gray-600 mb-2">이메일 <span className="text-red-500">*</span></label>
              <input
                id="consult-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={100}
                disabled={isSubmitting}
                className={inputClass}
                placeholder="example@email.com"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <label htmlFor="consult-category" className="block text-sm font-medium text-gray-600 mb-2">상담 분야</label>
                <div className="relative">
                  <select
                    id="consult-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <SelectArrow />
                </div>
              </div>
              <div>
                <label htmlFor="consult-method" className="block text-sm font-medium text-gray-600 mb-2">희망 상담 방식</label>
                <div className="relative">
                  <select
                    id="consult-method"
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <SelectArrow />
                </div>
              </div>
              <div>
                <label htmlFor="consult-time" className="block text-sm font-medium text-gray-600 mb-2">연락 가능한 시간</label>
                <div className="relative">
                  <select
                    id="consult-time"
                    name="availableTime"
                    value={formData.availableTime}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <SelectArrow />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="consult-content" className="block text-sm font-medium text-gray-600 mb-2">상담 내용 <span className="text-red-500">*</span></label>
              <textarea
                id="consult-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                required
                minLength={10}
                maxLength={1000}
                disabled={isSubmitting}
                className={`${inputClass} resize-none`}
                placeholder="간략한 사건 개요를 적어주세요. (주민등록번호 등 민감 정보는 제외)"
              ></textarea>
            </div>

            <div className="border border-gray-200 bg-gray-50 p-4 rounded-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  required
                  disabled={isSubmitting}
                  className="mt-1 w-4 h-4 accent-brand-gold shrink-0"
                />
                <span className="text-sm text-gray-600 break-keep">
                  개인정보 수집·이용에 동의합니다. <span className="text-red-500">*</span>{' '}
                  <Link href="/privacy" className="text-brand-gold underline underline-offset-2 hover:text-brand-dark transition-colors" target="_blank">
                    개인정보처리방침 보기
                  </Link>
                </span>
              </label>
              <details className="mt-2 ml-7 text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-brand-dark transition-colors">수집·이용 내용 보기</summary>
                <div className="mt-2 space-y-1 leading-relaxed">
                  <p>· 수집 항목: 이름, 연락처, 이메일, 상담 내용</p>
                  <p>· 수집 목적: 상담 신청 접수 및 회신</p>
                  <p>· 보유 기간: 상담 처리 완료 후 지체 없이 파기 (관계 법령에 따른 보존 의무가 있는 경우 예외)</p>
                  <p>· 동의를 거부하실 수 있으나, 거부 시 온라인 상담 신청이 제한됩니다.</p>
                </div>
              </details>
            </div>

            {submitStatus === 'sent' && (
              <div className="border border-brand-gold/40 bg-brand-light p-5 rounded-sm text-sm text-brand-dark leading-relaxed break-keep" role="status" aria-live="polite">
                상담 신청이 접수되었습니다. 담당 변호사가 내용 확인 후 기재해주신 연락처로 연락드리겠습니다.
                접수만으로 위임계약이 성립하는 것은 아닙니다.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="border border-red-200 bg-red-50 p-5 rounded-sm text-sm text-red-700 leading-relaxed break-keep" role="alert" aria-live="assertive">
                {errorMessage}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-white font-bold tracking-wide transition-all duration-300 shadow-lg flex justify-center items-center gap-2 ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#222] hover:bg-brand-gold'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    전송 중...
                  </>
                ) : (
                  <>
                    상담 신청하기
                    <Send size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-6">
                제출하신 정보는 변호사법 비밀유지의무에 따라 철저히 보호됩니다.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

function SelectArrow() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  );
}
