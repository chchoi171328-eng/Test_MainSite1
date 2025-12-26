import React from 'react';

interface LogoProps {
  className?: string;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10", textClassName = "text-xl" }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`${className} relative`}>
        {/* Simplified SVG representation of the Golden Circle with Waves */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <circle cx="50" cy="50" r="50" fill="#C5A47E" />
          <path d="M10 50 C 30 40, 70 40, 90 50" stroke="white" strokeWidth="6" fill="none" opacity="0.9" />
          <path d="M15 65 C 35 55, 65 55, 85 65" stroke="white" strokeWidth="5" fill="none" opacity="0.9" />
          <path d="M25 35 C 40 28, 60 28, 75 35" stroke="white" strokeWidth="5" fill="none" opacity="0.9" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-sans font-bold tracking-wide text-brand-dark ${textClassName}`}>
          법무법인 명
        </span>
        <span className="text-[0.65rem] tracking-[0.2em] text-brand-gold uppercase font-semibold">
          Sol & Luna
        </span>
      </div>
    </div>
  );
};