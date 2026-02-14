"use client";

import { useParams } from "next/navigation";
import { useAlternatives } from "@/context/AlternativesContext";
import AlternativeCard from "@/components/AlternativeCard";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import DirectorySkeleton from "@/components/DirectorySkeleton";

export default function TagSlugPage() {
    const params = useParams();
    const { alternatives, loading } = useAlternatives();
    const [sortBy, setSortBy] = useState("time-desc");

    // Pagination
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 9;
    const isFirstRun = useRef(true);

    // Scroll to top
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const tagName = decodeURIComponent(params.slug as string);

    // Reset pagination
    useEffect(() => {
        setPage(1);
    }, [tagName, sortBy]);

    // Get all tags
    const allTags = useMemo(() => {
        if (!alternatives || alternatives.length === 0) return [];
        const tagSet = new Set<string>();
        alternatives.forEach(alt => {
            alt.tags?.forEach(tag => {
                if (tag) tagSet.add(tag);
            });
        });
        return Array.from(tagSet).sort();
    }, [alternatives]);

    // Filter by tag and sort
    const filteredTools = useMemo(() => {
        if (!alternatives || alternatives.length === 0) return [];

        let result = alternatives.filter(alt => alt.tags?.includes(tagName));

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
    }, [alternatives, tagName, sortBy]);

    // Pagination Slice
    const paginatedTools = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE;
        return filteredTools.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredTools, page]);

    const totalPages = Math.ceil(filteredTools.length / PAGE_SIZE);

    return (
        <div className="min-h-screen relative">
            <main className="relative z-10 pt-32 pb-20">
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
                        <Link href="/tag" className="hover:text-white transition-colors flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Tags
                        </Link>
                        <span>/</span>
                        <span className="text-white">#{tagName}</span>
                    </nav>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-2">
                            TAG
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            #{tagName}
                        </h1>
                    </div>

                    {/* Tags and Sort */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
                        {/* Tag Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
                            <Link
                                href="/tag"
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                            >
                                All
                            </Link>
                            {allTags.slice(0, 15).map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/tag/${encodeURIComponent(tag)}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tagName === tag
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-white/5 text-gray-300 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="time-desc">Sort by Time (desc)</option>
                                <option value="time-asc">Sort by Time (asc)</option>
                                <option value="name-asc">Sort by Name (A-Z)</option>
                                <option value="name-desc">Sort by Name (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {/* Tools Grid */}
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

                    {/* Empty State */}
                    {!loading && filteredTools.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No tools found</h3>
                            <p className="text-gray-400 mb-4">
                                No tools found with the tag "{tagName}"
                            </p>
                            <Link
                                href="/tag"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                                View all tags
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
