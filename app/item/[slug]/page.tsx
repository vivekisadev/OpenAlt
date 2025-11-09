"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchGitHubStats, formatNumber, formatDate } from "@/lib/github";
import { Alternative } from "@/context/AlternativesContext";

interface GitHubStats {
    stars: number;
    forks: number;
    issues: number;
    lastUpdated: string;
}

export default function ItemPage() {
    const params = useParams();
    const [item, setItem] = useState<Alternative | null>(null);
    const [loading, setLoading] = useState(true);
    const [githubStats, setGitHubStats] = useState<GitHubStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    useEffect(() => {
        if (params.slug) {
            fetch(`/api/tools/${params.slug}`)
                .then(res => {
                    if (!res.ok) throw new Error("Not found");
                    return res.json();
                })
                .then(data => {
                    setItem(data);
                    setLoading(false);
                })
                .catch(() => {
                    setItem(null);
                    setLoading(false);
                });
        }
    }, [params.slug]);

    useEffect(() => {
        if (item?.githubUrl) {
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
        }
    }, [item?.githubUrl]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-[#050505] relative flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Tool not found</h1>
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300">
                        ← Back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] relative">
            <main className="relative z-10 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb - Tag path only */}
                    <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-8">
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
                        {item.tags && item.tags.length > 0 && (
                            <>
                                <span>/</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    {item.tags.slice(0, 3).map((tag, idx) => (
                                        <div key={tag} className="flex items-center gap-2">
                                            <Link
                                                href={`/tag/${encodeURIComponent(tag)}`}
                                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                            {idx < Math.min(item.tags!.length - 1, 2) && <span className="text-gray-600">,</span>}
                                        </div>
                                    ))}
                                    {item.tags.length > 3 && (
                                        <span className="text-gray-500">+{item.tags.length - 3}</span>
                                    )}
                                </div>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-white">{item.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Left Content - 3 columns */}
                        <div className="lg:col-span-3">
                            {/* Header */}
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 p-3 flex items-center justify-center border border-white/10 flex-shrink-0">
                                    <img
                                        src={item.logo}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold text-white mb-3">{item.name}</h1>
                                    <p className="text-gray-300 text-lg mb-6">{item.description}</p>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Visit Website
                                    </a>
                                </div>
                            </div>

                            {/* Long Description */}
                            <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                                    {item.longDescription || item.description}
                                </p>
                            </div>

                            {/* Key Features */}
                            {item.features && item.features.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-white mb-4">Key Features:</h2>
                                    <div className="space-y-4">
                                        {item.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                </div>
                                                <p className="text-gray-300 text-base">{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar - 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Preview Image */}
                            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-1 aspect-video flex items-center justify-center border border-white/10 shadow-2xl">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={`${item.name} Screenshot`}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-8">
                                        <img
                                            src={item.logo}
                                            alt={item.name}
                                            className="w-32 h-32 object-contain drop-shadow-2xl"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Information Card */}
                            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Website</span>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-400 hover:text-indigo-300 text-sm truncate max-w-[200px]"
                                        >
                                            {new URL(item.url).hostname}
                                        </a>
                                    </div>
                                    {item.createdAt && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Published date</span>
                                            <span className="text-white text-sm">{formatDate(item.createdAt)}</span>
                                        </div>
                                    )}
                                    {item.rating && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Rating</span>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(item.rating!)
                                                            ? "text-yellow-400"
                                                            : "text-gray-600"
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                <span className="text-white text-sm ml-1">{item.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* GitHub Stats */}
                            {item.githubUrl && (
                                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white">GitHub Stats</h3>
                                        <a
                                            href={item.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-400 hover:text-indigo-300"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </a>
                                    </div>
                                    {loadingStats ? (
                                        <div className="flex justify-center py-8">
                                            <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                        </div>
                                    ) : githubStats ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                                <div className="text-2xl font-bold text-yellow-400">{formatNumber(githubStats.stars)}</div>
                                                <div className="text-xs text-gray-500 mt-1">Stars</div>
                                            </div>
                                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                                <div className="text-2xl font-bold text-indigo-400">{formatNumber(githubStats.forks)}</div>
                                                <div className="text-xs text-gray-500 mt-1">Forks</div>
                                            </div>
                                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                                <div className="text-2xl font-bold text-green-400">{formatNumber(githubStats.issues)}</div>
                                                <div className="text-xs text-gray-500 mt-1">Issues</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm text-center py-4">Stats unavailable</p>
                                    )}
                                </div>
                            )}

                            {/* Categories */}
                            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href={`/category/${encodeURIComponent(item.category)}`}
                                        className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/20 transition-colors"
                                    >
                                        {item.category}
                                    </Link>
                                    {item.pricing && (
                                        <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
                                            {item.pricing}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map((tag) => (
                                            <Link
                                                key={tag}
                                                href={`/tag/${encodeURIComponent(tag)}`}
                                                className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-sm hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
