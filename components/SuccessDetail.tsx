import React from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigation } from '../contexts/NavigationContext';
import { ArrowLeft, Trophy, FileText, AlertCircle } from 'lucide-react';

export const SuccessDetail: React.FC = () => {
  const { successCases } = useData();
  const { detailId, navigateTo } = useNavigation();
  
  const caseItem = successCases.find(c => c.id === detailId);

  if (!caseItem) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-4">성공사례 정보를 찾을 수 없습니다.</p>
            <button 
                onClick={() => navigateTo('success')}
                className="text-brand-gold font-bold hover:underline"
            >
                목록으로 돌아가기
            </button>
        </div>
    );
  }

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <button 
            onClick={() => navigateTo('success')}
            className="flex items-center text-sm text-gray-500 hover:text-brand-dark mb-8 transition-colors group"
        >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 목록으로
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Case Information */}
            <div>
                <header className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider bg-brand-light text-brand-dark px-2 py-1 rounded-sm border border-gray-200">
                            {caseItem.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-brand-gold px-2 py-1 border border-brand-gold/30 rounded-sm">
                            <Trophy size={12} /> {caseItem.result}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark leading-tight mb-6">
                        {caseItem.title}
                    </h1>
                </header>

                <article className="prose prose-lg max-w-none text-gray-600 mb-8">
                     <h3 className="text-xl font-bold text-brand-dark mb-4">사건 개요 및 결과</h3>
                    <div className="whitespace-pre-wrap leading-relaxed bg-gray-50 p-6 rounded-sm border-l-4 border-brand-dark">
                        {caseItem.description}
                    </div>
                </article>

                {!caseItem.judgmentUrl && (
                    <div className="p-4 bg-gray-50 text-gray-500 text-sm flex items-center gap-2 rounded-sm">
                        <AlertCircle size={16} />
                        등록된 판결문 이미지가 없습니다.
                    </div>
                )}
            </div>

            {/* Right: Judgment Document Viewer */}
            {caseItem.judgmentUrl && (
                <div className="bg-gray-100 rounded-sm border border-gray-200 overflow-hidden flex flex-col h-[800px] shadow-lg">
                    <div className="bg-brand-dark text-white px-4 py-3 flex items-center justify-between">
                        <span className="font-bold flex items-center gap-2">
                            <FileText size={18} /> 판결문/결정문 확인
                        </span>
                    </div>
                    <div className="flex-grow bg-gray-200 overflow-auto flex items-center justify-center p-4 relative">
                        {caseItem.judgmentFormat === 'pdf' ? (
                            <iframe 
                                src={caseItem.judgmentUrl} 
                                className="w-full h-full border-none bg-white shadow-sm"
                                title="판결문 뷰어"
                            />
                        ) : (
                            <img 
                                src={caseItem.judgmentUrl} 
                                alt="판결문" 
                                className="max-w-full h-auto shadow-md"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};