import React from 'react';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'text';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    onClick,
    className = '',
    disabled = false,
    type = 'button',
}) => {
    const baseStyles = "font-bold transition-all duration-300 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-brand-gold text-white hover:bg-yellow-700 shadow-lg hover:shadow-xl hover:scale-105",
        secondary: "border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white",
        ghost: "border border-white/30 text-white hover:bg-white hover:text-brand-dark",
        text: "text-neutral-600 hover:text-brand-gold underline-offset-4 hover:underline"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
