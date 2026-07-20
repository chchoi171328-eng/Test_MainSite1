'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { LegalPost } from '../types';

interface LegalInfoProps {
  posts: LegalPost[];
}

const PAGE_SIZE = 20;

export const LegalInfo: React.FC<LegalInfoProps> = ({ posts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  const filtered = activeCategory ? posts.filter((p) => p.category === activeCategory) : posts;

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);
  const visiblePosts = filtered.slice(0, visibleCount);

  const selectCategory = (category: string | null) => {
    router.replace(category ? `/insights?category=${encodeURIComponent(category)}` : '/insights', {
      scroll: false,
    });
  };

  return (
    <section id="legal-info" className="py-16 md:py-20 bg-brand-light">
      <div className="container mx-auto px-6 md:px-12">
        {/* 제목·서브 문구·desk-still 이미지 헤더는 PageHeader가 담당 */}
        {categories.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-2 max-w-4xl mx-auto" role="tablist" aria-label="분야 필터">
            <button
              role="tab"
              aria-selected={!activeCategory}
              onClick={() => selectCategory(null)}
              className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
                !activeCategory
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => selectCategory(category)}
                className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
                  activeCategory === category
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        <div className="space-y-4 max-w-4xl mx-auto">
          {visiblePosts.map((post) => {
            const thumbnail = post.imageUrls?.[0];
            return (
              <Link
                key={post.id}
                href={`/insights/${post.id}`}
                className="flex gap-5 md:gap-6 bg-white p-4 md:p-5 group cursor-pointer border border-transparent hover:border-brand-gold/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-sm"
              >
                {thumbnail && (
                  <div className="relative flex-shrink-0 w-28 md:w-40 aspect-video self-start overflow-hidden rounded-sm bg-gray-100">
                    <Image
                      src={thumbnail}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 112px, 160px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-gray-400 font-medium">{post.date}</span>
                    {post.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark mb-1.5 line-clamp-2 break-keep leading-snug group-hover:text-brand-gold transition-colors">
                    {post.listTitle || post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 text-left">
                    {post.summary}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {visibleCount < filtered.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              className="inline-flex items-center gap-2 px-8 py-3 border border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all duration-300 rounded-sm"
            >
              더보기 ({visibleCount}/{filtered.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
