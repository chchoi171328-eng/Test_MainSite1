import React from 'react';
import { Phone } from 'lucide-react';

export const FloatingCallButton: React.FC = () => {
    const phoneNumber = '02-538-0072'; // 법무법인 명 전화번호
    const telLink = `tel:${phoneNumber.replace(/-/g, '')}`; // tel:025380072

    return (
        <a
            href={telLink}
            className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-brand-gold text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="전화 상담"
        >
            <Phone size={24} className="animate-pulse" />
        </a>
    );
};
