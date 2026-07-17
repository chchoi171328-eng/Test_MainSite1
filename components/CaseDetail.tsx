import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, FileDigit } from 'lucide-react';
import { LegalCase } from '../types';

interface CaseDetailProps {
    caseItem: LegalCase;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseItem }) => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 md:px-12 max-w-4xl">
                <Link
                    href="/legal-cases"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-brand-dark mb-8 transition-colors group"
                >
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 목록으로
                </Link>

                <header className="mb-12 bg-gray-50 p-8 rounded-sm border-l-4 border-brand-gold">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(caseItem.tags || []).map((tag, i) => (
                            <span key={i} className="text-xs font-bold uppercase tracking-wider bg-white text-brand-gold px-2 py-1 rounded-sm border border-brand-gold/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-6 leading-snug">
                        {caseItem.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600 font-mono">
                        <div className="flex items-center gap-2">
                            <Scale size={16} />
                            <span>{caseItem.court}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileDigit size={16} />
                            <span>{caseItem.caseNumber}</span>
                        </div>
                    </div>
                </header>

                <article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-dark prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-brand-dark">
                    <div className="prose prose-lg max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: caseItem.content || caseItem.summary || '' }} />
                </article>

                <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
                    <Link
                        href="/legal-cases"
                        className="px-8 py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors"
                    >
                        목록으로
                    </Link>
                </div>
            </div>
        </section>
    );
};
