"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import AlternativeCard from "@/components/AlternativeCard";
import Modal from "@/components/Modal";
import { useAlternatives } from "@/context/AlternativesContext";
import { CATEGORIES } from "@/data/categories";

function SearchPageContent() {
    const { alternatives } = useAlternatives();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAlt, setSelectedAlt] = useState<any | null>(null);
    const [categorySearchQuery, setCategorySearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = searchParams.get("q");
        const cat = searchParams.get("category");

        if (q) setQuery(q);
        if (cat && CATEGORIES.includes(cat)) setSelectedCategory(cat);
    }, [searchParams]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const filtered = useMemo(() => {
        let result = alternatives;

        // Filter by Category
        if (selectedCategory !== "All Categories") {
            result = result.filter((a) =>
                a.category.toLowerCase() === selectedCategory.toLowerCase() ||
                a.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
            );
        }

        // Filter by Query
        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((a) =>
                a.name.toLowerCase().includes(lowerQuery) ||
                a.description.toLowerCase().includes(lowerQuery) ||
                (a.tags && a.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
            );
        }

        return result;
    }, [query, selectedCategory, alternatives]);

    const filteredCategories = useMemo(() => {
        if (!categorySearchQuery) {
            return ["All Categories", ...CATEGORIES];
        }
        const lowerQuery = categorySearchQuery.toLowerCase();
        return ["All Categories", ...CATEGORIES].filter(cat =>
            cat.toLowerCase().includes(lowerQuery)
        );
    }, [categorySearchQuery]);

    return (
        <div className="min-h-screen font-sans selection:bg-indigo-500/30 relative cursor-none">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">

                {/* Search Section */}
                <div className="max-w-3xl mx-auto mb-12">

                    {/* Search Input with Integrated Category Dropdown */}
                    <div className="flex items-center gap-3 relative z-40">
                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group flex-1"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                            <div className="relative flex items-center bg-[#0a0a0a] rounded-full border border-white/10 shadow-2xl">
                                <div className="pl-6 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={`Search in ${selectedCategory === "All Categories" ? "all tools" : selectedCategory}...`}
                                    className="w-full bg-transparent border-none px-4 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:ring-0"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="pr-6 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Compact Category Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-4 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium transition-all hover:bg-white/5 hover:border-white/20 shadow-xl group whitespace-nowrap"
                            >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="text-gray-300 group-hover:text-white transition-colors">
                                    {selectedCategory === "All Categories" ? "Filter" : selectedCategory}
                                </span>
                                <svg
                                    className={`w-3 h-3 text-gray-500 transition-transform duration-300 group-hover:text-white ${isDropdownOpen ? "rotate-180" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-2 w-72 max-h-[400px] overflow-hidden bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col"
                                >
                                    {/* Category Searcher */}
                                    <div className="p-3 border-b border-white/5 bg-[#1a1a1a] sticky top-0 z-10">
                                        <div className="relative">
                                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Find a category..."
                                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                                value={categorySearchQuery}
                                                onChange={(e) => setCategorySearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-2">
                                        {filteredCategories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setIsDropdownOpen(false);
                                                    setCategorySearchQuery("");
                                                }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group ${selectedCategory === cat
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                <span>{cat}</span>
                                                {selectedCategory === cat && (
                                                    <motion.svg
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </motion.svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Results */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                    {filtered.map((alt, index) => (
                        <AlternativeCard
                            key={alt.id}
                            alternative={alt}
                            index={index}
                            disableAnimation={true}
                            onClick={() => setSelectedAlt(alt)}
                        />
                    ))}
                </div>

                {query && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No results found for &quot;{query}&quot;</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!selectedAlt}
                onClose={() => setSelectedAlt(null)}
                item={selectedAlt}
            />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
