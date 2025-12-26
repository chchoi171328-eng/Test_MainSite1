import React from 'react';
import { Trophy, ArrowUpRight, ArrowRight, FileCheck } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNavigation } from '../contexts/NavigationContext';

interface SuccessCasesProps {
  limit?: number;
}

export const SuccessCases: React.FC<SuccessCasesProps> = ({ limit }) => {
  const { successCases } = useData();
  const { navigateTo } = useNavigation();

  const displayCases = limit ? successCases.slice(0, limit) : successCases;

  return (
    <section id="success" className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Success Stories</span>
          <h2 className="text-4xl font-serif font-bold text-brand-dark">성공사례</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayCases.map((item) => (
             <div 
                key={item.id} 
                onClick={() => navigateTo('success-detail', item.id)}
                className="border border-gray-100 p-8 rounded-sm hover:shadow-lg transition-shadow duration-300 relative group overflow-hidden cursor-pointer"
             >
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="mb-4 flex justify-between items-start">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider border border-brand-gold/30 px-2 py-1">{item.category}</span>
                    <span className="text-brand-dark font-bold flex items-center gap-1 text-sm">
                        <Trophy size={14} className="text-brand-gold"/> {item.result}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{item.description}</p>
                <div className="flex justify-between items-center">
                    <span className="inline-flex items-center text-sm font-semibold text-brand-dark hover:text-brand-gold transition-colors">
                        자세히 보기 <ArrowUpRight size={16} className="ml-1" />
                    </span>
                    {item.judgmentUrl && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <FileCheck size={14} /> 판결문 포함
                        </span>
                    )}
                </div>
             </div>
          ))}
        </div>

        {limit && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => navigateTo('success')}
              className="inline-flex items-center gap-2 px-8 py-3 border border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all duration-300 rounded-sm"
            >
              성공사례 더보기 <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}