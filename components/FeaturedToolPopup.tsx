"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlternatives, Alternative } from "@/context/AlternativesContext";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedToolPopup() {
    const { alternatives, loading } = useAlternatives();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Initial Appearance Delay
    useEffect(() => {
        if (!loading && alternatives.length > 0) {
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [loading, alternatives.length]);

    // Cycling Logic
    useEffect(() => {
        if (!isVisible || isHovered || alternatives.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % alternatives.length);
        }, 8000);

        return () => clearInterval(timer);
    }, [isVisible, isHovered, alternatives.length]);

    if (loading || alternatives.length === 0) return null;

    const currentTool = alternatives[currentIndex];

    return (
        <div
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full md:w-[22rem] hidden md:block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                {isVisible && currentTool && (
                    <motion.div
                        key={currentTool.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-full"
                    >
                        <div className="relative bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-4 flex gap-4 items-center group cursor-pointer hover:border-white/20 transition-colors overflow-hidden">
                            <Link href={`/item/${currentTool.id}`} className="absolute inset-0 z-10" data-cursor-text="DISCOVER" />

                            {/* Close Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setIsVisible(false);
                                }}
                                className="absolute -top-2 -right-2 bg-[#222] text-gray-400 border border-white/10 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black z-20 shadow-lg"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Logo */}
                            <div className="relative z-0 flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                                {currentTool.logo ? (
                                    <Image
                                        src={currentTool.logo}
                                        alt={currentTool.name}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-contain"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 font-bold text-lg">
                                        {currentTool.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="relative z-0 flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-bold text-sm text-white truncate">{currentTool.name}</h4>
                                    {currentTool.paidAlternative && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full font-bold uppercase tracking-wider max-w-[120px] truncate">
                                            Vs {currentTool.paidAlternative}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                    {currentTool.description}
                                </p>
                            </div>

                            {/* Arrow Action */}
                            <div className="relative z-0 flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-all">
                                <svg className="w-4 h-4 transform group-hover:rotate-[-45deg] transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
