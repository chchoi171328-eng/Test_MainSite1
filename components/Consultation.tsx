import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export const Consultation: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '기업 법무',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 실제 운영 환경에서는 이 부분에서 백엔드 API(예: /api/send-email)를 호출해야 합니다.
    // 현재는 프론트엔드 데모 환경이므로 전송 과정을 시뮬레이션합니다.
    try {
        // 네트워크 지연 시뮬레이션 (1.5초)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 전송 성공 처리
        alert(`[발송 완료]\n\n${formData.name}님의 상담 신청이 접수되었습니다.\n담당 변호사가 내용 확인 후 기재해주신 연락처(${formData.phone})로\n빠른 시일 내에 연락드리겠습니다.\n\n(수신처: sllaw@sllaw.co.kr)`);
        
        // 폼 초기화
        setFormData({
            name: '',
            phone: '',
            category: '기업 법무',
            content: ''
        });
    } catch (error) {
        alert('상담 신청 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-white flex justify-center items-center min-h-[80vh]">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">온라인 상담 신청</h2>
            <div className="w-16 h-1 bg-brand-gold"></div>
        </div>

        <div className="bg-white p-0 md:p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">이름 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={20}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors text-brand-dark placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400" 
                    placeholder="홍길동" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">연락처 <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={13}
                    title="010-0000-0000 형식으로 입력해주세요."
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors text-brand-dark placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400" 
                    placeholder="숫자만 입력 (예: 01012345678)" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">상담 분야</label>
                <div className="relative">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors text-brand-dark appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="기업 법무">기업 법무</option>
                      <option value="민사 소송">민사 소송</option>
                      <option value="형사 변호">형사 변호</option>
                      <option value="가사 / 상속">가사 / 상속</option>
                      <option value="부동산 / 건설">부동산 / 건설</option>
                      <option value="기타">기타</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">상담 내용 <span className="text-red-500">*</span></label>
                <textarea 
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={6} 
                    required
                    maxLength={1000}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors text-brand-dark placeholder-gray-400 resize-none disabled:bg-gray-100 disabled:text-gray-400" 
                    placeholder="간략한 사건 개요를 적어주세요."
                ></textarea>
              </div>

              <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-4 text-white font-bold tracking-wide transition-all duration-300 shadow-lg flex justify-center items-center gap-2 ${
                        isSubmitting 
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