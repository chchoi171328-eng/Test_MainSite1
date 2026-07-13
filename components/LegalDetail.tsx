import React from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigation } from '../contexts/NavigationContext';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

export const LegalDetail: React.FC = () => {
    const { legalPosts } = useData();
    const { detailId, navigateTo } = useNavigation();

    const post = legalPosts.find(p => p.id === detailId);

    if (!post) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">게시글을 찾을 수 없습니다.</p>
                <button
                    onClick={() => navigateTo('legal')}
                    className="text-brand-gold font-bold hover:underline"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 md:px-12 max-w-4xl">
                <button
                    onClick={() => navigateTo('legal')}
                    className="flex items-center text-sm text-gray-500 hover:text-brand-dark mb-8 transition-colors group"
                >
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 목록으로
                </button>

                <header className="mb-12 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-4 mb-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Tag size={12} /> {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} /> {post.date}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark leading-tight">
                        {post.title}
                    </h1>
                </header>

                {(!post.imageUrls || post.imageUrls.length === 0) && (
                    <div className="relative h-48 md:h-60 mb-10 overflow-hidden rounded-sm">
                        <img
                            src="/assets/brand/desk-still.webp"
                            alt="변호사 책상 위의 책과 만년필"
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                )}

                <article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-dark prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-brand-dark">
                    <div className="prose prose-lg max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content || post.summary || '' }} />
                </article>

                <p className="mt-12 text-gray-600 break-keep">
                    이 글에서 다 답이 되지 않은 부분은 편하게 물어보셔도 됩니다.{' '}
                    <button
                        onClick={() => navigateTo('consultation')}
                        className="text-brand-gold underline underline-offset-4 hover:text-brand-dark transition-colors"
                    >
                        상담 문의하기
                    </button>
                </p>

                <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
                    <button
                        onClick={() => navigateTo('legal')}
                        className="px-8 py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors"
                    >
                        목록으로
                    </button>
                </div>
            </div>
        </section>
    );
};