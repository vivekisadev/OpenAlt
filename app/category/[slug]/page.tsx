"use client";

import { useParams } from "next/navigation";
import { useAlternatives } from "@/context/AlternativesContext";
import AlternativeCard from "@/components/AlternativeCard";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function CategorySlugPage() {
    const params = useParams();
    const { alternatives } = useAlternatives();
    const [sortBy, setSortBy] = useState("time-desc");

    const categoryName = decodeURIComponent(params.slug as string);

    // Get all categories
    const allCategories = useMemo(() => {
        if (!alternatives || alternatives.length === 0) return [];
        const categorySet = new Set<string>();
        alternatives.forEach(alt => {
            if (alt.category) categorySet.add(alt.category);
        });
        return Array.from(categorySet).sort();
    }, [alternatives]);

    // Filter by category and sort
    const filteredTools = useMemo(() => {
        if (!alternatives || alternatives.length === 0) return [];

        let result = alternatives.filter(alt => alt.category === categoryName);

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
    }, [alternatives, categoryName, sortBy]);

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
                        <Link href="/category" className="hover:text-white transition-colors">
                            Category
                        </Link>
                        <span>/</span>
                        <span className="text-white">{categoryName}</span>
                    </nav>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-2">
                            CATEGORY
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            {categoryName}
                        </h1>
                    </div>

                    {/* Categories and Sort */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
                        {/* Category Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
                            <Link
                                href="/category"
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                            >
                                All
                            </Link>
                            {allCategories.map((category) => (
                                <Link
                                    key={category}
                                    href={`/category/${encodeURIComponent(category)}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${categoryName === category
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {category}
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
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTools.map((tool, index) => (
                            <AlternativeCard
                                key={tool.id}
                                alternative={tool}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredTools.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No tools found</h3>
                            <p className="text-gray-400 mb-4">
                                No tools found in the "{categoryName}" category
                            </p>
                            <Link
                                href="/category"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                                View all categories
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
