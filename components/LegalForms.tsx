import React from 'react';
import { FileText, Download, Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { LegalForm } from '../types';

export const LegalForms: React.FC = () => {
  const { legalForms } = useData();

  const handleDownload = (form: LegalForm) => {
    // 1. If real file data exists (uploaded via Admin)
    if (form.fileUrl) {
      const link = document.createElement('a');
      link.href = form.fileUrl;
      link.download = `${form.title}.${form.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // 2. Fallback: Create dummy content for the demo files
    const content = `
[${form.title}]

본 문서는 법무법인 명(SOL & LUNA)에서 제공하는 법률 서식 예시입니다.
이 파일은 데모 목적으로 생성된 샘플 파일입니다.

실제 사용을 위해서는 전문가의 법률 검토가 필요합니다.

Category: ${form.category}
Format: ${form.format}
Date: ${new Date().toLocaleDateString()}
    `;

    // Create a Blob from the content
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Set the file name with the appropriate extension
    const extension = form.format.toLowerCase();
    link.download = `${form.title}.${extension}`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section id="legal-forms" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Legal Forms</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">법률 서식</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto break-keep">
            자주 사용되는 필수 법률 서식을 무료로 제공해 드립니다. <br/>
            다운로드하여 상황에 맞게 수정해 사용하세요.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <input 
            type="text" 
            placeholder="필요한 서식을 검색해보세요 (예: 내용증명)" 
            className="w-full px-6 py-4 pl-12 bg-white rounded-sm shadow-sm border border-gray-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Forms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legalForms.map((form) => (
            <div key={form.id} className="bg-white p-6 rounded-sm border border-gray-200 hover:border-brand-gold/50 hover:shadow-md transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-sm transition-colors ${form.fileUrl ? 'bg-brand-gold text-white' : 'bg-brand-light text-brand-dark group-hover:bg-brand-gold group-hover:text-white'}`}>
                  <FileText size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-sm">{form.category}</span>
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">{form.title}</h3>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold">{form.format}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{form.size}</span>
                </div>
                <button 
                  onClick={() => handleDownload(form)}
                  className="flex items-center gap-1 text-sm font-bold text-brand-gold hover:text-brand-dark transition-colors"
                >
                  <Download size={16} /> 다운로드
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-brand-light/50 border border-brand-gold/20 rounded-sm text-center">
            <p className="text-sm text-gray-600">
                ※ 제공되는 서식은 법적 효력을 보장하지 않으며, 구체적인 사안에 따라 변호사의 검토가 필요할 수 있습니다.
            </p>
        </div>
      </div>
    </section>
  );
};