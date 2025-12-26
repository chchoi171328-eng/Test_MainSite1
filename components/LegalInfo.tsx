import React from 'react';
import { BookOpen, Scale, FileText, Newspaper } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNavigation } from '../contexts/NavigationContext';

export const LegalInfo: React.FC = () => {
  const { legalPosts } = useData();
  const { navigateTo } = useNavigation();

  // Helper to get random icon for variety since we aren't storing icon names in DB for this demo
  const getIcon = (index: number) => {
    const icons = [BookOpen, FileText, Scale, Newspaper];
    const Icon = icons[index % icons.length];
    return <Icon size={32} />;
  };

  return (
    <section id="legal-info" className="py-20 bg-brand-light">
      <div className="container mx-auto px-6 md:px-12">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Legal Insights</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">최신 법률 정보</h2>
            <p className="mt-4 text-gray-500 max-w-2xl text-sm md:text-base break-keep">
                법무법인 명의 변호사들이 직접 분석한 최신 법률 이슈와 실무 가이드를 제공합니다.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalPosts.map((post, index) => (
                <div 
                    key={post.id} 
                    onClick={() => navigateTo('legal-detail', post.id)}
                    className="bg-white p-8 group cursor-pointer hover:-translate-y-1 transition-transform duration-300 border border-transparent hover:border-brand-gold/30 shadow-sm hover:shadow-md rounded-sm"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-brand-gold bg-brand-light p-3 rounded-full group-hover:bg-brand-gold group-hover:text-white transition-colors">
                            {getIcon(index)}
                        </div>
                        {post.category && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-sm">
                                {post.category}
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-400 mb-3 font-medium">{post.date}</div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3 line-clamp-2 group-hover:text-brand-gold transition-colors leading-snug">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{post.summary}</p>
                    <div className="mt-4 text-xs font-bold text-gray-400 group-hover:text-brand-dark transition-colors text-right">
                         자세히 보기 &rarr;
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};