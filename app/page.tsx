"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import AlternativeCard from "@/components/AlternativeCard";
import Hero from "@/components/Hero";
import { motion, AnimatePresence } from "framer-motion";
import { useAlternatives } from "@/context/AlternativesContext";
import { useDebounce } from "@/hooks/useDebounce";
import DirectorySkeleton from "@/components/DirectorySkeleton";
import SkeletonCard from "@/components/SkeletonCard";

// Lazy loading non-critical components
const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), { ssr: false });

export default function Home() {
  const { alternatives, loading } = useAlternatives();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300); // 300ms debounce

  // Pagination state (Standard Pagination)
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const isFirstRun = useRef(true);

  // Scroll to top of directory on page change
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const directory = document.getElementById("directory");
    if (directory) {
      // Offset for header (approx 100px)
      const y = directory.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [page]);

  type Alt = typeof alternatives[0];

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset pagination on search change
  }, []);

  // Optimized filtering usage memo
  const filtered = useMemo(() => {
    if (!alternatives || alternatives.length === 0) return [];

    return alternatives.filter((a) => {
      if (!a) return false;
      const matchesSearch =
        debouncedSearch === "" ||
        a.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (a.tags && a.tags.some(tag => tag?.toLowerCase().includes(debouncedSearch.toLowerCase())));
      return matchesSearch;
    });
  }, [debouncedSearch, alternatives]);

  // Slice for pagination (Show ONLY current page items)
  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // Infinite scroll removed for standard pagination

  return (
    <div className="min-h-screen bg-[#050608] text-white relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"
        />
      </div>

      <WelcomePopup />
      <main className="relative z-10">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
        <Hero />

        {/* Search Input - Enhanced */}
        <div className="max-w-2xl mx-auto mb-16 px-4 relative z-20">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <input
              type="text"
              placeholder="Search specifically designed alternatives..."
              value={search}
              onChange={handleSearchChange}
              className="relative w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-full py-4 px-6 pl-14 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-2xl group-hover:shadow-indigo-500/10"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-hover:text-indigo-400 transition-colors duration-300 transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32" id="directory">


          {/* Grid Layout */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            <AnimatePresence mode="wait">
              {paginatedItems.map((alt, i) => (
                <AlternativeCard
                  key={alt.id}
                  alternative={alt}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Controls - Premium UI */}
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

          {/* Empty States */}
          {loading && (
            <DirectorySkeleton />
          )}

          {!loading && alternatives.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <h3 className="text-xl font-medium text-white mb-2">No tools available</h3>
              <p className="text-gray-400">The directory is currently empty.</p>
            </motion.div>
          )}

          {alternatives.length > 0 && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search.
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </main >

      {/* Detail Modal */}

    </div >
  );
}
