"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useAlternatives } from "@/context/AlternativesContext";
import AlternativeCard from "@/components/AlternativeCard";
import Link from "next/link";
import { motion } from "framer-motion";
import Dropdown from "@/components/Dropdown";

import DirectorySkeleton from "@/components/DirectorySkeleton";
import SkeletonCard from "@/components/SkeletonCard";

export default function CategoryPage() {
    const { alternatives, loading } = useAlternatives();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("time-desc");

    // Pagination
    const [page, setPage] = useState(1);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const PAGE_SIZE = 9;
    const isFirstRun = useRef(true);

    // Scroll to top on page change
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Simple scroll to top
    }, [page]);

    // Reset pagination on filter change
    useEffect(() => {
        setPage(1);
    }, [selectedCategory, sortBy]);

    // Extract all unique categories
    const allCategories = useMemo(() => {
        if (!alternatives || alternatives.length === 0) return [];
        const categorySet = new Set<string>();
        alternatives.forEach(alt => {
            if (alt.category) categorySet.add(alt.category);
        });
        return Array.from(categorySet).sort();
    }, [alternatives]);

    // Get tools filtered by category
    const filteredTools = useMemo(() => {
        if (!alternatives || alternatives.length === 0) return [];

        let result = selectedCategory === "All"
            ? alternatives
            : alternatives.filter(alt => alt.category === selectedCategory);

        // Apply sorting
        if (sortBy === "time-desc") {
            result = [...result].sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        } else if (sortBy === "time-asc") {
            result = [...result].sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateA - dateB;
            });
        } else if (sortBy === "name-asc") {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "name-desc") {
            result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        }

        return result;
    }, [alternatives, selectedCategory, sortBy]);

    const paginatedTools = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE;
        return filteredTools.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredTools, page]);

    const totalPages = Math.ceil(filteredTools.length / PAGE_SIZE);

    // Infinite scroll removed

    const sortOptions = [
        { label: "Sort by Time (Newest)", value: "time-desc" },
        { label: "Sort by Time (Oldest)", value: "time-asc" },
        { label: "Sort by Name (A-Z)", value: "name-asc" },
        { label: "Sort by Name (Z-A)", value: "name-desc" },
    ];

    return (
        <div className="min-h-screen relative">
            <main className="relative z-10 pt-40 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-white">Category</span>
                        {selectedCategory !== "All" && (
                            <>
                                <span>/</span>
                                <span className="text-indigo-400">{selectedCategory}</span>
                            </>
                        )}
                    </nav>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-2">
                            CATEGORY
                        </p>
                        <h1 className={`font-bold text-white mb-8 ${selectedCategory === "All"
                            ? "text-4xl md:text-5xl"
                            : "text-2xl md:text-3xl"
                            }`}>
                            {selectedCategory === "All" ? "Explore by categories" : selectedCategory}
                        </h1>
                    </div>

                    {/* Filter System */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 mb-12 shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Category Dropdown */}
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ml-1">
                                    Select Category
                                </label>
                                <Dropdown
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    options={[
                                        { label: "All Categories", value: "All" },
                                        ...allCategories.map(c => ({ label: c, value: c }))
                                    ]}
                                    placeholder="Select Category"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="w-full md:w-64">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ml-1">
                                    Sort Results
                                </label>
                                <Dropdown
                                    value={sortBy}
                                    onChange={setSortBy}
                                    options={sortOptions}
                                />
                            </div>
                        </div>
                    </div>


                    {loading ? (
                        <DirectorySkeleton />
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                            {paginatedTools.map((tool, index) => (
                                <AlternativeCard
                                    key={tool.id}
                                    alternative={tool}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
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

                    {/* Empty State */}
                    {!loading && filteredTools.length === 0 && alternatives.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No tools found</h3>
                            <p className="text-gray-400 mb-4">
                                No tools found in the "{selectedCategory}" category
                            </p>
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                                View all tools
                            </button>
                        </motion.div>
                    )}

                    {/* Loading State */}
                    {alternatives.length === 0 && (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
