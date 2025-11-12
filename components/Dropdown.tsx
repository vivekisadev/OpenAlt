"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
    label: string;
    value: string;
}

interface DropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
}

export default function Dropdown({ value, onChange, options, placeholder = "Select...", className = "" }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-left transition-all duration-200 hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${isOpen ? "ring-2 ring-indigo-500/50 border-indigo-500/50 bg-white/10" : ""}`}
            >
                <span className={`block truncate ${!selectedOption && !value ? "text-gray-400" : "text-white"}`}>
                    {selectedOption ? selectedOption.label : (value || placeholder)}
                </span>
                <span className="pointer-events-none flex items-center ml-2">
                    <svg
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-50 mt-2 w-full rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-black/50 max-h-60 overflow-auto focus:outline-none py-1 backdrop-blur-xl"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${option.value === value
                                        ? "bg-indigo-600/20 text-indigo-400"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span>{option.label}</span>
                                {option.value === value && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
