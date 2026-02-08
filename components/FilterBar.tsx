"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface FilterBarProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

function FilterBar({ categories, activeCategory, onSelect }: FilterBarProps) {
    return (
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto scrollbar-hide pb-4 px-4">
            {["All", ...categories].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 z-10 ${isActive ? "text-black" : "text-gray-400 hover:text-white"
                            }`}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            />
                        )}
                        <span className="relative">{cat}</span>
                    </button>
                );
            })}
        </div>
    );
}

// Memoize to prevent re-renders when other state changes (like search)
export default memo(FilterBar);
