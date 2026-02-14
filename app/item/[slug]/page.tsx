"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import { fetchGitHubStats, formatNumber, formatDate, getRelativeTime } from "@/lib/github";
import { Alternative, useAlternatives } from "@/context/AlternativesContext";
import ReportModal from "@/components/ReportModal";
import AlternativeCard from "@/components/AlternativeCard";
import Magnetic from "@/components/Magnetic";

import FeaturedCarousel from "@/components/FeaturedCarousel";
import ItemPageSkeleton from "@/components/ItemPageSkeleton";

interface GitHubStats {
    stars: number;
    forks: number;
    issues: number;
    lastUpdated: string;
    lastPush: string;
    createdAt: string;
}

export default function ItemPage() {
    const params = useParams();
    const { alternatives } = useAlternatives();
    const [item, setItem] = useState<Alternative | null>(null);
    const [loading, setLoading] = useState(true);
    const [githubStats, setGitHubStats] = useState<GitHubStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const { scrollY, scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

    function handleMouseMovePreview(event: React.MouseEvent<HTMLAnchorElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    }

    function handleMouseLeavePreview() {
        x.set(0);
        y.set(0);
    }

    useEffect(() => {
        const unsubscribe = scrollY.onChange((latest) => {
            setIsHeaderVisible(latest > 400);
        });
        return () => unsubscribe();
    }, [scrollY]);

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

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    const [logoSrc, setLogoSrc] = useState<string | null>(null);

    // Sync logoSrc when item loads
    useEffect(() => {
        if (item) {
            setLogoSrc(item.logo);
        }
    }, [item]);

    const handleImageError = () => {
        if (!logoSrc || !item) return;

        // Helper to extract domain
        const getDomain = (url: string) => {
            try {
                return new URL(url).hostname;
            } catch {
                return "";
            }
        };

        const domain = getDomain(item.url);
        if (!domain) {
            setLogoSrc(null);
            return;
        }

        // Fallback chain: original → site favicon → Google favicon → Clearbit → initials
        if (logoSrc === item.logo) {
            setLogoSrc(`https://${domain}/favicon.ico`);
        } else if (logoSrc.includes(`${domain}/favicon.ico`)) {
            setLogoSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
        } else if (logoSrc.includes("google.com/s2/favicons")) {
            setLogoSrc(`https://logo.clearbit.com/${domain}`);
        } else {
            setLogoSrc(null);
        }
    };

    if (loading) {
        return <ItemPageSkeleton />;
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-[#030014] relative flex items-center justify-center">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl font-bold text-white mb-4">Tool not found</h1>
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300">
                        Back to Directory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050608] text-white pt-32 pb-20">
            {/* Ambient Background - Breathing */}
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

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* Sticky Scroll Header */}
            <AnimatePresence>
                {isHeaderVisible && (
                    <motion.div
                        initial={{ y: -20, opacity: 0, x: "-50%" }}
                        animate={{ y: 0, opacity: 1, x: "-50%" }}
                        exit={{ y: -20, opacity: 0, x: "-50%" }}
                        transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 20,
                        }}
                        className="fixed top-24 left-1/2 z-[45] flex items-center bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-full p-1.5 pl-4 pr-1.5 max-w-[90vw] w-fit"
                    >
                        <div className="flex items-center gap-3 pr-4 border-r border-white/10 mr-4">
                            <div className="w-6 h-6 rounded-md bg-[#111] border border-white/10 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                                {logoSrc ? (
                                    <Image
                                        src={logoSrc}
                                        alt={item.name}
                                        width={24}
                                        height={24}
                                        className="w-full h-full object-contain"
                                        onError={handleImageError}
                                        unoptimized
                                    />
                                ) : (
                                    <span className="text-[10px] font-bold text-indigo-400">{item.name.charAt(0)}</span>
                                )}
                            </div>
                            <span className="text-sm font-bold text-white whitespace-nowrap truncate max-w-[120px] sm:max-w-none">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                            >
                                Visit <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>

                            {/* Icon Actions */}
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Report Issue" onClick={() => setShowReportModal(true)}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                                    </svg>
                                </button>
                                {item.githubUrl && (
                                    <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="View Code">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                key={item?.id || 'content'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                    mass: 1
                }}
                className="max-w-[1400px] mx-auto px-6 relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

                    {/* LEFT COLUMN - MAIN CONTENT */}
                    <div className="flex flex-col">

                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-sm font-medium tracking-wide text-gray-500 mb-6 group">
                            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Directory
                            </Link>
                            <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <Link href={`/category/${encodeURIComponent(item.category)}`} className="hover:text-white transition-colors">
                                {item.category}
                            </Link>
                            <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-300 pointer-events-none" aria-current="page">
                                {item.name}
                            </span>
                        </nav>

                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-[#111] border border-white/10 p-3 flex-shrink-0 shadow-2xl overflow-hidden flex items-center justify-center">
                                    {logoSrc ? (
                                        <Image
                                            src={logoSrc}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-contain"
                                            onError={handleImageError}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 font-bold text-3xl rounded-lg">
                                            {item.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 tracking-tight mb-2 selection:bg-indigo-500/30">{item.name}</h1>
                                        {item.pricing && (
                                            <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider border shadow-sm self-start mt-2 ${(item.pricing.toLowerCase() === "free" || item.pricing.toLowerCase() === "open source")
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.1)]"
                                                : item.pricing.toLowerCase() === "freemium"
                                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.1)]"
                                                    : "bg-white/5 border-white/10 text-gray-300"
                                                }`}>
                                                {item.pricing}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="p-2 rounded-lg bg-[#111] border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                                    title="Report Issue"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xl text-gray-400 leading-relaxed mb-6 max-w-3xl">
                            {item.longDescription || item.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-10">
                            <div className="flex items-center gap-2 mr-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Tags</span>
                            </div>
                            {item.tags && item.tags.length > 0 ? (
                                item.tags.map(tag => (
                                    <Link key={tag} href={`/tag/${tag}`} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                                        {tag}
                                    </Link>
                                ))
                            ) : (
                                <span className="text-sm text-gray-600">No tags</span>
                            )}
                        </div>

                        {/* Alternative To Section */}
                        <div className="mb-10">
                            <h3 className="text-sm text-gray-500 font-medium mb-4">Open Source Alternative to:</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                {item.paidAlternative ? (
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#111] border border-white/5">
                                        <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                            {item.paidAlternative.charAt(0)}
                                        </div>
                                        <span className="text-gray-300 font-medium">{item.paidAlternative}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#111] border border-white/5">
                                        <span className="text-gray-300 font-medium">Top Commercial Tools in {item.category}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Advantages Comparison Table */}
                        {item.paidAlternative && (
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Why Choose {item.name}?
                                </h3>
                                <div className="rounded-lg border border-white/10 overflow-hidden bg-gradient-to-br from-white/[0.02] to-white/[0.01]">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Feature</th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-emerald-400">{item.name}</th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-red-400">{item.paidAlternative}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-4 text-sm text-gray-300">Cost</td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-emerald-400 font-medium text-xs">Free</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        <span className="text-red-400 font-medium text-xs">Paid</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-4 text-sm text-gray-300">Open Source</td>
                                                <td className="py-3 px-4 text-center">
                                                    <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <svg className="w-5 h-5 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-4 text-sm text-gray-300">Self-Hostable</td>
                                                <td className="py-3 px-4 text-center">
                                                    <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <svg className="w-5 h-5 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-4 text-sm text-gray-300">Privacy Control</td>
                                                <td className="py-3 px-4 text-center">
                                                    <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <svg className="w-5 h-5 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-4 text-sm text-gray-300">No Vendor Lock-in</td>
                                                <td className="py-3 px-4 text-center">
                                                    <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <svg className="w-5 h-5 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 italic">
                                    * Advantages based on typical open-source vs proprietary software comparison
                                </p>
                            </div>
                        )}

                        {/* Primary Actions */}
                        <div className="flex items-center gap-4 mb-10">
                            <Magnetic>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)]"
                                >
                                    Visit Website
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </Magnetic>

                            {item.githubUrl && (
                                <Magnetic>
                                    <a
                                        href={item.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 rounded-xl bg-[#111] border border-white/10 text-white font-medium hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.337-3.369-1.337-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                                        </svg>
                                        Source Code
                                    </a>
                                </Magnetic>
                            )}
                        </div>

                        {/* Large Preview */}
                        <div>
                            <motion.a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block relative w-full aspect-[16/9] bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl mb-8 group hover:border-white/20 transition-all duration-500 cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center z-20">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Gloss Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-10" />

                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={`${item.name} Preview`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full relative bg-[#111]">
                                        <Image
                                            src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(item.url)}?w=1280&h=720`}
                                            alt={`${item.name} Live Preview`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </motion.a>
                        </div>

                        {/* Share Bar */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleCopyLink}
                                className="h-9 px-4 rounded-lg bg-[#111] border border-white/10 flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-all hover:bg-white/5 active:scale-95 min-w-[120px] justify-center"
                            >
                                <AnimatePresence mode="wait">
                                    {showCopied ? (
                                        <motion.span
                                            key="copied"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            className="flex items-center gap-2 text-green-400 font-bold"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Copied
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="copy"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Copy Link
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 mr-2">Share:</span>
                                {/* Social Icons - Placeholders */}
                                {['X', 'LinkedIn', 'Reddit', 'WhatsApp'].map((social) => (
                                    <button key={social} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                                        <span className="sr-only">{social}</span>
                                        {/* Simple dot placeholder for now, replace with icons if needed */}
                                        <div className="w-4 h-4 rounded-full border border-current opacity-70" title={social} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit">

                        {/* Stats Card */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20">
                            <div className="space-y-6">
                                {/* Stars */}
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <span className="text-sm font-medium">Stars</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500/50 w-3/4 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                        </div>
                                        <span className="text-white font-mono font-bold">{githubStats ? formatNumber(githubStats.stars) : '-'}</span>
                                    </div>
                                </div>

                                {/* Forks */}
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span className="text-sm font-medium">Forks</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500/50 w-1/2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                        </div>
                                        <span className="text-white font-mono font-bold">{githubStats ? formatNumber(githubStats.forks) : '-'}</span>
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                                {/* Meta Stats */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Posted on
                                        </span>
                                        <span className="text-gray-300 font-medium">
                                            {item.createdAt ? formatDate(item.createdAt.toString()) : 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Repository age
                                        </span>
                                        <span className="text-gray-300 font-medium">
                                            {githubStats && githubStats.createdAt ? getRelativeTime(githubStats.createdAt) : 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <a
                                        href={item.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 rounded-xl border border-white/10 text-center text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all shadow-sm hover:shadow-md"
                                    >
                                        Checkout Github Repo
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center text-indigo-400 shadow-inner">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-white tracking-tight text-lg">Key Features</h3>
                            </div>

                            {item.features && item.features.length > 0 ? (
                                <ul className="space-y-3">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                            <svg className="w-5 h-5 text-indigo-500/70 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm italic">No specific features listed.</p>
                            )}
                        </div>

                        {/* Similar Projects Mini-Grid */}
                        <FeaturedCarousel />

                    </div>
                </div>
            </motion.div>

            {/* Related Tools Section */}
            {
                item && (
                    <RelatedToolsSection item={item} />
                )
            }

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                toolId={item.id}
                toolName={item.name}
            />
        </div>
    );
}

function RelatedToolsSection({ item }: { item: Alternative }) {
    // We need to fetch alternatives if they aren't loaded, but useAlternatives handles context.
    // However, useAlternatives hook might be used inside this component safely.
    const { alternatives } = useAlternatives();
    const relatedTools = alternatives
        .filter(t => t.category === item.category && t.id !== item.id);

    if (relatedTools.length === 0) return null;

    return (
        <div className="max-w-[1400px] mx-auto px-6 mt-20 mb-20 relative z-10 border-t border-white/5 pt-16">
            <h2 className="text-2xl font-bold text-white mb-8">More {item.category} Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedTools.map((tool, idx) => (
                    <div key={tool.id}>
                        <AlternativeCard alternative={tool} index={idx} />
                    </div>
                ))}
            </div>
        </div>
    );
}


