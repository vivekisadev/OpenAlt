"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { memo, useState, useRef } from "react";
import PaidAlternativePreview from "./PaidAlternativePreview";

export interface Alternative {
    id: string;
    category: string;
    name: string;
    description: string;
    longDescription?: string;
    url: string;
    logo: string;
    tags?: string[];
    pricing?: string;
    paidAlternative?: string;
}

interface AlternativeCardProps {
    alternative: Alternative;
    disableAnimation?: boolean;
    index?: number;
    className?: string; // Allow custom classes
    onClick?: () => void;
}

function AlternativeCard({
    alternative,
    disableAnimation = false,
    index = 0,
    className = "",
    onClick,
}: AlternativeCardProps) {
    const [logoSrc, setLogoSrc] = useState<string | null>(alternative.logo);
    const [hoveredTool, setHoveredTool] = useState<{ name: string; x: number; y: number } | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeInOut" as const,
                delay: index * 0.05
            }
        }
    };

    // Spotlight Logic (2D only)
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouseX.set(x);
        mouseY.set(y);
    }

    function onMouseLeave() {
        // Optional: fade out spotlight?
        // We rely on opacity-0 group-hover:opacity-100 handling the visibility.
    }

    const handleImageError = () => {
        if (!logoSrc) return;

        // Helper to extract domain
        const getDomain = (url: string) => {
            try {
                return new URL(url).hostname;
            } catch {
                return "";
            }
        };

        const domain = getDomain(alternative.url);
        if (!domain) {
            setLogoSrc(null);
            return;
        }

        // Fallback chain: original → site favicon → Google favicon → Clearbit → initials
        if (logoSrc === alternative.logo) {
            setLogoSrc(`https://${domain}/favicon.ico`);
        } else if (logoSrc.includes(`${domain}/favicon.ico`)) {
            setLogoSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
        } else if (logoSrc.includes("google.com/s2/favicons")) {
            setLogoSrc(`https://logo.clearbit.com/${domain}`);
        } else {
            setLogoSrc(null);
        }
    };

    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            ref={cardRef}
            initial={disableAnimation ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className={`h-full group ${className}`}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                onMouseLeave();
            }}
        >
            <div className="relative h-full w-full">
                <Link
                    href={`/item/${alternative.id}`}
                    className="relative block h-full w-full"
                    onClick={onClick}
                    draggable={false}
                    data-cursor-text="VIEW"
                >
                    {/* Glowing Border Background (Behind everything) */}
                    <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-b from-white/10 to-white/5 opacity-0 group-hover:opacity-100 group-hover:from-indigo-500/40 group-hover:via-purple-500/20 group-hover:to-transparent transition-all duration-700 ease-[cubic-bezier(0.25,0.4,0.25,1)] blur-sm group-hover:blur-md" />

                    {/* Card Container - Fluid Motion Background */}
                    <motion.div
                        className="relative h-full w-full rounded-lg border overflow-hidden flex flex-col"
                        animate={{
                            backgroundColor: isHovered ? "rgba(255, 255, 255, 0.9)" : "rgba(24, 24, 27, 0.5)",
                            borderColor: isHovered ? "rgba(255, 255, 255, 0.5)" : "rgba(39, 39, 42, 1)",
                            boxShadow: isHovered ? "0px 20px 40px -15px rgba(255,255,255,0.2)" : "0px 0px 0px 0px rgba(0,0,0,0)"
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >

                        {/* Inner Content Background - Fluid Motion */}
                        <motion.div
                            className="absolute inset-[6px] rounded-md z-0"
                            animate={{
                                backgroundColor: isHovered ? "#F3F4F6" : "#0A0A0A"
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        />

                        {/* Inner Shell Border */}
                        <div className="absolute inset-[6px] rounded-md border border-white/5 group-hover:border-black/5 transition-colors duration-500 pointer-events-none z-[5]" />

                        {/* Spotlight Overlay */}
                        <motion.div
                            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 z-10"
                            style={{
                                background: useMotionTemplate`
                                    radial-gradient(
                                        500px circle at ${mouseX}px ${mouseY}px,
                                        rgba(0, 0, 0, 0.04),
                                        rgba(0, 0, 0, 0.02),
                                        transparent 60%
                                    )
                                `
                            }}
                        />

                        <div className="p-5 flex flex-col h-full relative z-20">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <motion.div
                                        className="w-14 h-14 rounded-2xl border p-2.5 flex items-center justify-center shrink-0 shadow-lg overflow-hidden backdrop-blur-sm"
                                        animate={{
                                            backgroundColor: isHovered ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.03)",
                                            borderColor: isHovered ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
                                            scale: isHovered ? 1.05 : 1
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    >
                                        {logoSrc ? (
                                            <Image
                                                src={logoSrc}
                                                alt=""
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-contain"
                                                onError={handleImageError}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 font-bold text-2xl rounded-lg">
                                                {alternative.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </motion.div>
                                    <div className="min-w-0 flex-1">
                                        <motion.h3
                                            title={alternative.name}
                                            className="text-lg font-bold leading-tight truncate"
                                            animate={{ color: isHovered ? "#000000" : "#ffffff" }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        >
                                            {alternative.name}
                                        </motion.h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <motion.span
                                                className="text-xs font-medium truncate"
                                                animate={{ color: isHovered ? "#6B7280" : "#6B7280" }}
                                            >
                                                {alternative.category}
                                            </motion.span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status/Pricing Badge */}
                                {alternative.pricing && (
                                    <div className="shrink-0 ml-3 z-20">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border shadow-sm block whitespace-nowrap transition-colors duration-300 ${(alternative.pricing.toLowerCase() === "free" || alternative.pricing?.toLowerCase() === "open source")
                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:text-emerald-600 group-hover:border-emerald-600/20 group-hover:bg-emerald-600/10"
                                            : alternative.pricing?.toLowerCase() === "freemium"
                                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:text-amber-600 group-hover:border-amber-600/20 group-hover:bg-amber-600/10"
                                                : "bg-white/5 border-white/10 text-gray-300 group-hover:bg-black/5 group-hover:border-black/10 group-hover:text-gray-600"
                                            }`}>
                                            {alternative.pricing}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-4 flex-grow">
                                <motion.p
                                    className="text-sm leading-relaxed line-clamp-2"
                                    animate={{ color: isHovered ? "#4B5563" : "#9CA3AF" }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    {alternative.description}
                                </motion.p>
                            </div>

                            {/* Footer Area - Swaps Content on Hover */}
                            <div className="relative h-10 mt-auto">
                                {/* State 1: Tags (Default Visible, Hover Hidden) */}
                                <div className="absolute inset-0 flex items-center transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2 group-hover:pointer-events-none">
                                    {alternative.tags && alternative.tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5 opacity-60">
                                            {alternative.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/5 truncate max-w-[80px]">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-600 italic">View details</span>
                                    )}
                                </div>

                                {/* State 2: Alternative To (Default Hidden, Hover Visible) */}
                                <div className="absolute inset-0 flex items-center transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 overflow-hidden pr-4">
                                    <span className="text-gray-500 text-xs font-medium mr-3 shrink-0 group-hover:text-gray-800">
                                        Alternative to:
                                    </span>
                                    {alternative.paidAlternative ? (
                                        (() => {
                                            const alternatives = alternative.paidAlternative?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];
                                            const showOnlyLogos = alternatives.length > 1;

                                            return (
                                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
                                                    {alternatives.map((altName, idx) => {
                                                        const colors = [
                                                            "from-orange-500 to-red-500",
                                                            "from-blue-500 to-cyan-500",
                                                            "from-emerald-500 to-teal-500",
                                                            "from-purple-500 to-pink-500",
                                                            "from-indigo-500 to-violet-500",
                                                            "from-rose-500 to-pink-500",
                                                            "from-amber-500 to-orange-500",
                                                        ];
                                                        let hash = 0;
                                                        for (let i = 0; i < altName.length; i++) hash = altName.charCodeAt(i) + ((hash << 5) - hash);
                                                        const colorClass = colors[Math.abs(hash) % colors.length];

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-1.5 shrink-0 cursor-help relative"
                                                                onMouseEnter={(e) => {
                                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                                    setHoveredTool({
                                                                        name: altName,
                                                                        x: rect.left,
                                                                        y: rect.top - 10
                                                                    });
                                                                }}
                                                                onMouseLeave={() => setHoveredTool(null)}
                                                            >
                                                                <div className={`${showOnlyLogos ? 'w-6 h-6' : 'w-5 h-5'} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-[9px] text-white font-bold shadow-sm ring-1 ring-white/10`}>
                                                                    {altName.charAt(0).toUpperCase()}
                                                                </div>
                                                                {!showOnlyLogos && (
                                                                    <span className="text-sm font-bold text-gray-200 group-hover:text-black whitespace-nowrap transition-colors">
                                                                        {altName}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <span className="text-sm font-medium text-gray-400 group-hover:text-gray-500 italic">Commercial Tools</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Paid Alternative Preview Card */}
                {hoveredTool && (
                    <PaidAlternativePreview
                        toolName={hoveredTool.name}
                        position={{ x: hoveredTool.x, y: hoveredTool.y }}
                    />
                )}
            </div>
        </motion.div>
    );
}

export default memo(AlternativeCard);
