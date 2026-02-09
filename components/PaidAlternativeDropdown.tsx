"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaidAlternativeDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: string[]; // List of alternative names
    placeholder?: string;
    className?: string;
}

// Helper to generate consistent gradient
const getGradient = (name: string) => {
    const colors = [
        "from-orange-500 to-red-500",
        "from-blue-500 to-cyan-500",
        "from-emerald-500 to-teal-500",
        "from-purple-500 to-pink-500",
        "from-indigo-500 to-violet-500",
        "from-rose-500 to-pink-500",
        "from-amber-500 to-orange-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

export default function PaidAlternativeDropdown({
    value,
    onChange,
    options,
    placeholder = "Select Alternative...",
    className = ""
}: PaidAlternativeDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter options based on internal search
    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter(opt =>
            opt.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset search when closing
    useEffect(() => {
        if (!isOpen) setSearch("");
    }, [isOpen]);

    const selectedGradient = value ? getGradient(value) : "";

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* Label */}
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ml-1">
                Search Alternative
            </label>

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-left transition-all duration-300 hover:border-indigo-500/30 group active:scale-[0.98] ${isOpen ? "ring-2 ring-indigo-500/20 border-indigo-500/50 bg-[#111]" : ""}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Selected Icon */}
                    {value ? (
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${selectedGradient} flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0`}>
                            {value.charAt(0).toUpperCase()}
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    )}

                    <span className={`block truncate font-medium ${!value ? "text-gray-500" : "text-gray-200"}`}>
                        {value || placeholder}
                    </span>
                </div>

                <span className="pointer-events-none flex items-center ml-2 text-gray-500 group-hover:text-indigo-400 transition-colors">
                    <svg
                        className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-400" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                        className="absolute z-[60] mt-2 w-full rounded-xl bg-[#0F0F11]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-5px_gba(0,0,0,0.6)] overflow-hidden ring-1 ring-white/5"
                    >
                        {/* Search Input */}
                        <div className="p-2 border-b border-white/5">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Find tool..."
                                    className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:bg-white/10 focus:border-indigo-500/30 transition-all font-medium"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto px-2 py-2 premium-scrollbar">
                            <button
                                onClick={() => { onChange(""); setIsOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-1 group ${value === ""
                                    ? "bg-indigo-500/10 text-indigo-400"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/10 transition-colors">
                                    <span className="text-xs">All</span>
                                </div>
                                <span className="font-medium">All Alternatives</span>
                                {value === "" && (
                                    <motion.div layoutId="check" className="ml-auto">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </button>

                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => { onChange(option); setIsOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-1 group ${value === option
                                            ? "bg-indigo-500/10 text-indigo-400"
                                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${getGradient(option)} flex items-center justify-center shrink-0 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity`}>
                                            <span className="text-xs font-bold text-white tracking-tight">{option.substring(0, 2).toUpperCase()}</span>
                                        </div>
                                        <span className="font-medium truncate">{option}</span>
                                        {value === option && (
                                            <motion.div layoutId="check" className="ml-auto text-indigo-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                    No tools found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
