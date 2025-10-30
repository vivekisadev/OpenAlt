"use client";

import { useState, useMemo } from "react";
import AlternativeCard from "@/components/AlternativeCard";
import Modal from "@/components/Modal";
import Hero from "@/components/Hero";
import { motion } from "framer-motion";
import { useAlternatives } from "@/context/AlternativesContext";

export default function Home() {
  const { alternatives, loading } = useAlternatives();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  type Alt = typeof alternatives[0];
  const [selectedAlt, setSelectedAlt] = useState<Alt | null>(null);

  // Extract unique categories for the tab bar - only when data is loaded
  const categories = useMemo(() => {
    if (!alternatives || alternatives.length === 0) return [];
    const set = new Set(alternatives.map((a) => a?.category).filter(Boolean));
    return Array.from(set).sort();
  }, [alternatives]);

  // Filtered list
  const filtered = useMemo(() => {
    if (!alternatives || alternatives.length === 0) return [];

    return alternatives.filter((a) => {
      if (!a) return false;
      const matchesCategory = category === "All" || a.category === category;
      const matchesSearch =
        search === "" ||
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase()) ||
        (a.tags && a.tags.some(tag => tag?.toLowerCase().includes(search.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [search, category, alternatives]);

  return (
    <div className="min-h-screen relative">
      <main className="relative z-10">
        <Hero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32" id="directory">
          {/* Filter Bar */}
          <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto scrollbar-hide pb-4">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${category === cat
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                  : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"
                  }`}
                style={{ willChange: category === cat ? "transform" : "auto" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {filtered.map((alt, index) => (
              <AlternativeCard
                key={alt.id}
                alternative={alt}
                index={index}
                onClick={() => setSelectedAlt(alt)}
              />
            ))}
          </motion.div>

          {/* Empty States */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Loading tools...</h3>
              <p className="text-gray-400">Please wait while we fetch the directory.</p>
            </motion.div>
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
                {category !== "All"
                  ? `No tools found in "${category}" category${search ? " matching your search" : ""}.`
                  : "Try adjusting your search or category filter."}
              </p>
              <button
                onClick={() => {
                  setCategory("All");
                  setSearch("");
                }}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedAlt} onClose={() => setSelectedAlt(null)} item={selectedAlt} />
    </div>
  );
}
