"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAlternatives } from "@/context/AlternativesContext";
import { formatDate } from "@/lib/github";

export default function FeaturedCarousel() {
    const { alternatives } = useAlternatives();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [featuredTools, setFeaturedTools] = useState<any[]>([]);

    useEffect(() => {
        if (alternatives && alternatives.length > 0) {
            // Take the first 5 tools as featured for now
            setFeaturedTools(alternatives.slice(0, 5));
        }
    }, [alternatives]);

    useEffect(() => {
        if (featuredTools.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredTools.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [featuredTools]);

    if (featuredTools.length === 0) return null;

    const currentTool = featuredTools[currentIndex];

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Featured Today</h3>
                </div>
                {/* Progress Indicators */}
                <div className="flex gap-1">
                    {featuredTools.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-indigo-500 shadow-sm' : 'w-1.5 bg-white/10'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative h-28">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTool.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex items-start gap-4 h-full"
                    >
                        <Link href={`/item/${currentTool.id}`} className="shrink-0 group/img">
                            <div className="w-16 h-16 rounded-xl bg-[#111] border border-white/10 p-2 flex items-center justify-center transition-transform duration-300 group-hover/img:scale-105 group-hover/img:border-indigo-500/30">
                                {currentTool.logo ? (
                                    <Image
                                        src={currentTool.logo}
                                        alt={currentTool.name}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl">⚡</span>
                                )}
                            </div>
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                            <div>
                                <Link href={`/item/${currentTool.id}`} className="font-bold text-white text-lg truncate hover:text-indigo-400 transition-colors block mb-1">
                                    {currentTool.name}
                                </Link>
                                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed h-8">
                                    {currentTool.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 w-full">
                                <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                                    <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {currentTool.createdAt ? formatDate(currentTool.createdAt) : 'Recently'}
                                </span>

                                <Link
                                    href={`/item/${currentTool.id}`}
                                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/link uppercase tracking-wider"
                                >
                                    View
                                    <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                <motion.div
                    key={currentIndex}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-indigo-500 origin-left shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
            </div>
        </div>
    );
}
