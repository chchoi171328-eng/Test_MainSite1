'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export const FloatingCallButton: React.FC = () => {
    const phoneNumber = '031-658-6100'; // 법무법인 명 전화번호
    const telLink = `tel:${phoneNumber.replace(/-/g, '')}`;

    return (
        <a
            href={telLink}
            onClick={() => trackEvent('phone_click', { location: 'floating_button' })}
            className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-brand-gold text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="전화 상담"
        >
            <Phone size={24} className="animate-pulse" />
        </a>
    );
};
