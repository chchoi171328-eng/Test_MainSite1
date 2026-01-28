import React from 'react';

interface LogoProps {
  className?: string;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10", textClassName = "text-xl" }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`${className} relative`}>
        <img
          src="/logo1.png"
          alt="법무법인 명 로고"
          className="w-full h-full object-contain drop-shadow-sm"
        />
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