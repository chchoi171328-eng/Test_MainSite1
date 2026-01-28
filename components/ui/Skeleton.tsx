import React from 'react';

export const SkeletonCard: React.FC = () => (
    <div className="animate-pulse space-y-4 bg-white p-6 rounded-sm shadow-sm border border-gray-100">
        {/* Image placeholder */}
        <div className="h-48 bg-gray-200 rounded"></div>

        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>

        {/* Description lines */}
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>

        {/* Button placeholder */}
        <div className="h-10 bg-gray-200 rounded w-32 mt-4"></div>
    </div>
);

export const SkeletonList: React.FC = () => (
    <div className="animate-pulse space-y-4 bg-white p-6 rounded-sm shadow-sm border border-gray-100">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>

        {/* Meta info */}
        <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Content lines */}
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-11/12"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
    </div>
);

export const SkeletonTable: React.FC = () => (
    <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-sm border border-gray-100">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);
