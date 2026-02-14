"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import AlternativeCard from "@/components/AlternativeCard";
import { useAlternatives } from "@/context/AlternativesContext";
import { CATEGORIES } from "@/data/categories";
import DirectorySkeleton from "@/components/DirectorySkeleton";
import Dropdown from "@/components/Dropdown";
import PaidAlternativeDropdown from "@/components/PaidAlternativeDropdown";

function SearchPageContent() {
    const { alternatives, loading } = useAlternatives();
    const searchParams = useSearchParams();

    // Main Search
    const [query, setQuery] = useState("");

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filterAlternative, setFilterAlternative] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStack, setFilterStack] = useState("All");
    const [filterLicense, setFilterLicense] = useState("All");
    const [sortBy, setSortBy] = useState("time-desc"); // "relevance" or "time-desc"

    // Pagination
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 15;
    const isFirstRun = useRef(true);

    // Scroll to top on page change
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    // Reset pagination on filter change
    useEffect(() => {
        setPage(1);
    }, [query, filterAlternative, filterCategory, filterStack, filterLicense, sortBy]);

    // Initial Params
    useEffect(() => {
        const q = searchParams.get("q");
        const category = searchParams.get("category");
        if (q) setQuery(q);
        if (category && CATEGORIES.includes(category)) {
            setFilterCategory(category);
            setShowFilters(true);
        }
    }, [searchParams]);

    // Extract Options
    const { allTags, allPrices, allPaidAlternatives } = useMemo(() => {
        const tags = new Set<string>();
        const prices = new Set<string>();
        const paidAlts = new Set<string>();

        alternatives.forEach(alt => {
            alt.tags?.forEach(t => tags.add(t));
            if (alt.pricing) prices.add(alt.pricing);
            if (alt.paidAlternative) {
                // Split comma-separated alternatives
                alt.paidAlternative.split(',').forEach(p => {
                    const trimmed = p.trim();
                    if (trimmed) paidAlts.add(trimmed);
                });
            }
        });

        return {
            allTags: Array.from(tags).sort(),
            allPrices: Array.from(prices).sort(),
            allPaidAlternatives: Array.from(paidAlts).sort()
        };
    }, [alternatives]);

    const filtered = useMemo(() => {
        let result = alternatives;

        // 1. Text Search (Main Query) - Global
        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter((a) =>
                a.name.toLowerCase().includes(lowerQuery) ||
                a.description.toLowerCase().includes(lowerQuery) ||
                (a.tags && a.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
                a.category.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Specific Filters
        if (filterAlternative) {
            const lowerAlt = filterAlternative.toLowerCase();
            result = result.filter(a =>
                (a.paidAlternative && a.paidAlternative.toLowerCase().includes(lowerAlt))
            );
        }

        if (filterCategory !== "All") {
            result = result.filter(a => a.category === filterCategory);
        }

        if (filterStack !== "All") {
            result = result.filter(a => a.tags?.includes(filterStack));
        }

        if (filterLicense !== "All") {
            result = result.filter(a => a.pricing === filterLicense);
        }

        // Sorting
        if (sortBy === "time-desc") {
            result = [...result].sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        }

        return result;
    }, [query, filterAlternative, filterCategory, filterStack, filterLicense, sortBy, alternatives]);

    const paginatedFiltered = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE;
        return filtered.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    return (
        <div className="min-h-screen font-sans selection:bg-indigo-500/30 relative">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">

                {/* Search & Filter Header */}
                <div className="flex flex-col gap-6 mb-12 relative z-30">
                    {/* Top Row: Search | Filters | Sort */}
                    <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl blur-md opacity-50" />
                            <div className="relative flex items-center bg-[#0a0a0a] rounded-xl border border-white/10 shadow-lg overflow-hidden group focus-within:border-indigo-500/50 transition-colors">
                                <div className="pl-4 text-gray-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search tools..."
                                    className="w-full bg-transparent border-none px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-0"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                {query && (
                                    <button onClick={() => setQuery("")} className="pr-4 text-gray-500 hover:text-white">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border font-medium transition-all ${showFilters
                                    ? "bg-indigo-600 text-white border-indigo-500"
                                    : "bg-[#0a0a0a] text-gray-400 border-white/10 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Filters
                            </button>

                            <div className="w-40">
                                <Dropdown
                                    value={sortBy}
                                    onChange={setSortBy}
                                    options={[
                                        { label: "Newest", value: "time-desc" },
                                        { label: "Oldest", value: "time-asc" },
                                        { label: "A-Z", value: "name-asc" },
                                        { label: "Z-A", value: "name-desc" }
                                    ]}
                                    placeholder="Sort by"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Grid */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                                animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
                                exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                            >
                                {/* Alternative Search */}
                                <div>

                                    <PaidAlternativeDropdown
                                        value={filterAlternative}
                                        onChange={setFilterAlternative}
                                        options={allPaidAlternatives}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Search category</label>
                                    <Dropdown
                                        value={filterCategory}
                                        onChange={setFilterCategory}
                                        options={[
                                            { label: "All Categories", value: "All" },
                                            ...CATEGORIES.map(c => ({ label: c, value: c }))
                                        ]}
                                    />
                                </div>

                                {/* Stack */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Search stack</label>
                                    <Dropdown
                                        value={filterStack}
                                        onChange={setFilterStack}
                                        options={[
                                            { label: "All Stacks", value: "All" },
                                            ...allTags.map(t => ({ label: t, value: t }))
                                        ]}
                                    />
                                </div>

                                {/* License */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Search license</label>
                                    <Dropdown
                                        value={filterLicense}
                                        onChange={setFilterLicense}
                                        options={[
                                            { label: "All Licenses", value: "All" },
                                            ...allPrices.map(p => ({ label: p || "Unknown", value: p || "Unknown" }))
                                        ]}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Results */}
                {loading ? (
                    <DirectorySkeleton />
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
                            {paginatedFiltered.map((alt, index) => (
                                <AlternativeCard
                                    key={alt.id}
                                    alternative={alt}
                                    index={index}
                                    disableAnimation={true}
                                />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {!loading && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12 mb-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors flex items-center gap-2 group"
                                >
                                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm font-medium">Page</span>
                                    <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 font-bold text-white shadow-inner">
                                        {page}
                                    </span>
                                    <span className="text-gray-400 text-sm font-medium">of {totalPages}</span>
                                </div>

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors flex items-center gap-2 group"
                                >
                                    Next
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}


                {!loading && query && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No results found for &quot;{query}&quot;</p>
                    </div>
                )}
            </div>


        </div >
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
