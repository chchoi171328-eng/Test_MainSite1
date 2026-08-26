'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, Loader2, AlertTriangle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

// 간소화 방침 (2026-08): "전화할 번호 + 무슨 일인지"만 받는다.
// 이름(선택)·전화번호(필수)·상담 내용(필수) 3개 필드 — 분야·방식·시간·이메일 제거.
const INITIAL_FORM = {
  name: '',
  phone: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        } else if (numbers.length <= 10) {
          // 지역번호 10자리 (031-658-6100) — 3-3-4 묶음
          formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
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
        trackEvent('consult_submit');
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

  // 제출 완료 화면 — 폼을 대체한다. 추가 CTA·축하 연출·자동 리다이렉트 없음.
  if (submitStatus === 'sent') {
    return (
      <section className="py-20 md:py-32 bg-white flex justify-center items-center min-h-[80vh]">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="relative h-56 md:h-72 mb-12 overflow-hidden rounded-sm">
            <Image
              src="/assets/brand/tea-window.webp"
              alt="창가에 놓인 차 한 잔"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div role="status" aria-live="polite">
            <p className="text-xl md:text-2xl font-serif text-brand-dark leading-relaxed break-keep mb-4">
              접수되었습니다. 늦어도 다음 영업일에 사무실에서 전화드리겠습니다.
            </p>
            <p className="text-gray-600 leading-relaxed break-keep">
              그 전에 준비하실 것은 없습니다. 통화에서 있는 그대로 말씀해주시면 됩니다.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white flex justify-center items-center min-h-[70vh]">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* 제목·consult-chairs 이미지 헤더는 PageHeader가 담당 */}
        <div className="bg-white p-0 md:p-8">
          <p className="text-sm text-gray-500 mb-6 leading-relaxed break-keep">
            남겨주시면 늦어도 다음 영업일에 사무실에서 전화드립니다.
          </p>

          {/* 필수 안내 (지침 8단계) */}
          <div className="mb-10 border border-gray-200 bg-gray-50 p-5 rounded-sm text-sm text-gray-600 space-y-2 leading-relaxed break-keep">
            <p>· 초기 상담은 유료입니다. 대표변호사 법률상담은 60분 기준 150,000원(VAT 포함)이며, 상담이 30분 이내에 끝나면 100,000원만 받습니다. 사실관계와 자료를 확인하고, 법적 쟁점과 대응 방향을 말씀드립니다. 예약제로 진행되고 한국어·영어 상담 동일 요금이며, 정확한 안내는 접수 후 연락드릴 때 함께 드립니다.</p>
            <p>· 상담 신청 접수만으로 위임계약이 성립하지 않습니다. 사건 수임은 상담 후 별도의 위임계약으로 진행됩니다.</p>
            <p className="flex items-start gap-2 text-red-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>주민등록번호, 계좌 비밀번호 등 민감한 개인정보나 증거 원본 내용은 입력하지 마세요. 자세한 내용은 상담 시 안전하게 전달하실 수 있습니다.</span>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} onFocus={handleFormStart}>
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

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label htmlFor="consult-name" className="block text-sm font-medium text-gray-600 mb-2">성함 <span className="text-gray-400 font-normal">(선택)</span></label>
                <input
                  id="consult-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={20}
                  disabled={isSubmitting}
                  className={inputClass}
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label htmlFor="consult-phone" className="block text-sm font-medium text-gray-600 mb-2">전화번호 <span className="text-red-500">*</span></label>
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
                <p className="mt-2 text-xs text-gray-400 break-keep">상담 연락 외의 용도로 쓰지 않습니다.</p>
              </div>
            </div>

            <div>
              <label htmlFor="consult-content" className="block text-sm font-medium text-gray-600 mb-2">상담 내용 <span className="text-red-500">*</span></label>
              <textarea
                id="consult-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                required
                minLength={10}
                maxLength={1000}
                disabled={isSubmitting}
                className={`${inputClass} resize-none`}
                placeholder="어떤 일인지 편하게 적어주세요. 두세 문장이면 충분합니다."
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
                  <p>· 수집 항목: 성함(선택), 전화번호, 상담 내용</p>
                  <p>· 수집 목적: 상담 신청 접수 및 회신</p>
                  <p>· 보유 기간: 상담 처리 완료 후 지체 없이 파기 (관계 법령에 따른 보존 의무가 있는 경우 예외)</p>
                  <p>· 동의를 거부하실 수 있으나, 거부 시 온라인 상담 신청이 제한됩니다.</p>
                </div>
              </details>
            </div>

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
