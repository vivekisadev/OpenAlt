"use client";

import { useState, useMemo } from "react";
import { useAlternatives } from "@/context/AlternativesContext";
import AlternativeCard from "@/components/AlternativeCard";
import Modal from "@/components/Modal";
import Link from "next/link";
import { motion } from "framer-motion";
import Dropdown from "@/components/Dropdown";

export default function CategoryPage() {
    const { alternatives } = useAlternatives();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("time-desc");
    const [selectedAlt, setSelectedAlt] = useState<typeof alternatives[0] | null>(null);

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

                    {/* Categories and Sort */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
                        {/* Category Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === "All"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                All
                            </button>
                            {allCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-64">
                            <Dropdown
                                value={sortBy}
                                onChange={setSortBy}
                                options={sortOptions}
                            />
                        </div>
                    </div>

                    {/* Tools Grid - Using AlternativeCard */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTools.map((tool, index) => (
                            <AlternativeCard
                                key={tool.id}
                                alternative={tool}
                                index={index}
                                onClick={() => setSelectedAlt(tool)}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredTools.length === 0 && alternatives.length > 0 && (
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

            {/* Detail Modal */}
            <Modal isOpen={!!selectedAlt} onClose={() => setSelectedAlt(null)} item={selectedAlt} />
        </div>
    );
}
