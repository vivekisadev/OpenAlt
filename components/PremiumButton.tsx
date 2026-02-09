"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface PremiumButtonProps {
    href?: string;
    label: string;
    icon?: React.ReactNode;
    className?: string;
    external?: boolean;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'glass' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function PremiumButton({
    href,
    label,
    icon,
    className = "",
    external,
    onClick,
    variant = 'primary',
    size = 'lg',
    fullWidth = false,
    type,
    disabled
}: PremiumButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    const Element = href ? "a" : "button";

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const baseStyles = `
        relative overflow-hidden group cursor-pointer
        rounded-full font-bold
        transition-all duration-300 transform
        hover:scale-105 active:scale-95
        flex items-center justify-center gap-3
        ${fullWidth ? 'w-full' : sizes[size]}
    `;

    const variants = {
        primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600",
        glass: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/30",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
    };

    return (
        <Element
            href={href}
            onClick={onClick}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}
            type={type as "button" | "submit" | "reset" | undefined}
            disabled={disabled}
        >
            {/* Shimmer Effect */}
            <motion.div
                initial={{ x: "-100%" }}
                animate={isHovered ? { x: "200%" } : { x: "-100%" }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
            />

            {/* Icon */}
            {icon && <span className="relative z-10">{icon}</span>}

            {/* Label */}
            <span className="relative z-10">{label}</span>
        </Element>
    );
}
