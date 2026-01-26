"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchGitHubStats, formatNumber, formatDate, getRelativeTime } from "@/lib/github";

interface Alternative {
    id: string;
    category: string;
    name: string;
    description: string;
    longDescription?: string;
    url: string;
    githubUrl?: string;
    logo: string;
    tags?: string[];
    features?: string[];
    pricing?: string;
    rating?: number;
    createdAt?: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: Alternative | null;
}

interface GitHubStats {
    stars: number;
    forks: number;
    issues: number;
    lastUpdated: string;
}

export default function Modal({ isOpen, onClose, item }: ModalProps) {
    const [githubStats, setGitHubStats] = useState<GitHubStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Fetch GitHub stats when modal opens
    useEffect(() => {
        if (isOpen && item?.githubUrl) {
            setLoadingStats(true);
            fetchGitHubStats(item.githubUrl)
                .then((stats: GitHubStats | null) => {
                    setGitHubStats(stats);
                    setLoadingStats(false);
                })
                .catch(() => {
                    setGitHubStats(null);
                    setLoadingStats(false);
                });
        } else {
            setGitHubStats(null);
        }
    }, [isOpen, item?.githubUrl]);

    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - Reduced blur for performance */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm"
                        style={{ willChange: "opacity" }}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ pointerEvents: "none" }}>
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.96, opacity: 0, y: 5 }}
                            transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.8 }}
                            className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            style={{ pointerEvents: "auto", willChange: "transform, opacity" }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-sm border border-white/5"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <div className="flex flex-col md:flex-row h-full overflow-hidden">
                                {/* Left Side: Visuals & Quick Info */}
                                <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
                                    {/* Background Glow */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="w-32 h-32 rounded-2xl bg-white/5 p-4 flex items-center justify-center border border-white/10 shadow-2xl mb-6 backdrop-blur-sm">
                                            <img
                                                src={item.logo}
                                                alt={item.name}
                                                className="w-full h-full object-contain drop-shadow-lg"
                                            />
                                        </div>

                                        <h2 className="text-3xl font-bold text-white mb-2">{item.name}</h2>

                                        {/* Rating */}
                                        {item.rating && (
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-5 h-5 ${i < Math.floor(item.rating!)
                                                                ? "text-yellow-400"
                                                                : "text-gray-600"
                                                                }`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-400">{item.rating.toFixed(1)}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium uppercase tracking-wider">
                                                {item.category}
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium uppercase tracking-wider">
                                                {item.pricing || "Free & Open Source"}
                                            </span>
                                        </div>

                                        {/* GitHub Stats */}
                                        {item.githubUrl && (
                                            <div className="w-full mb-6">
                                                {loadingStats ? (
                                                    <div className="flex items-center justify-center py-4">
                                                        <div className="w-5 h-5 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                                    </div>
                                                ) : githubStats ? (
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                                            <svg className="w-5 h-5 text-yellow-400 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            <span className="text-sm font-bold text-white">{formatNumber(githubStats.stars)}</span>
                                                            <span className="text-xs text-gray-500">Stars</span>
                                                        </div>
                                                        <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                                            <svg className="w-5 h-5 text-indigo-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                            </svg>
                                                            <span className="text-sm font-bold text-white">{formatNumber(githubStats.forks)}</span>
                                                            <span className="text-xs text-gray-500">Forks</span>
                                                        </div>
                                                        <div className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                                            <svg className="w-5 h-5 text-green-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-sm font-bold text-white">{formatNumber(githubStats.issues)}</span>
                                                            <span className="text-xs text-gray-500">Issues</span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}

                                        {/* Posted Date */}
                                        {item.createdAt && (
                                            <div className="text-xs text-gray-500 mb-6">
                                                Posted {getRelativeTime(item.createdAt)} • {formatDate(item.createdAt)}
                                            </div>
                                        )}

                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg shadow-white/10"
                                        >
                                            <span>Visit Website</span>
                                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>

                                        {item.githubUrl && (
                                            <a
                                                href={item.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/10"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                <span>View on GitHub</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Details */}
                                <div className="w-full md:w-3/5 p-8 overflow-y-auto bg-[#0a0a0a]">
                                    <div className="mb-8">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            About
                                        </h3>
                                        <p className="text-gray-300 text-lg leading-relaxed">
                                            {item.longDescription || item.description}
                                        </p>
                                    </div>

                                    {item.features && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Key Features
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {item.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                        <div className="mt-1 min-w-[16px]">
                                                            <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-300 text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {item.tags && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                Tags
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {item.tags.map((tag) => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => {
                                                            onClose();
                                                            window.location.href = `/tag/${encodeURIComponent(tag)}`;
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                                    >
                                                        #{tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
