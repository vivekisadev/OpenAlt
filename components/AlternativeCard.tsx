"use client";

import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { MouseEvent, memo } from "react";
import Link from "next/link";

interface Alternative {
    id: string;
    category: string;
    name: string;
    description: string;
    url: string;
    logo: string;
    tags?: string[];
}

interface AlternativeCardProps {
    alternative: Alternative;
    onClick?: () => void;
    index?: number;
    disableAnimation?: boolean;
}

function AlternativeCard({
    alternative,
    onClick,
    index = 0,
    disableAnimation = false,
}: AlternativeCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Use transform instead of template for better performance
    const spotlightOpacity = useTransform(
        mouseX,
        [0, 200],
        [0, 0.1]
    );

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const animationProps = disableAnimation ? {} : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    };

    return (
        <motion.div
            {...animationProps}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="h-full will-change-transform"
            style={{ transform: "translateZ(0)" }}
        >
            <Link
                href={`/item/${alternative.id}`}
                className="group relative h-full bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 overflow-hidden flex flex-col hover:border-white/20 hover:shadow-2xl hover:shadow-indigo-500/10 block"
                onMouseMove={handleMouseMove}
            >
                {/* Spotlight Effect - Optimized */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                              500px circle at ${mouseX}px ${mouseY}px,
                              rgba(99, 102, 241, 0.08),
                              transparent 70%
                            )
                        `,
                    }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header: Logo & Badge */}
                    <div className="flex items-start justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 p-2 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-200">
                            <img
                                src={alternative.logo}
                                alt={alternative.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-[10px] font-medium text-green-400 uppercase tracking-wider">
                                Free
                            </span>
                            <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all transform group-hover:-rotate-45 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14" />
                                    <path d="M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors duration-200">
                            {alternative.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-2">
                            <span>{alternative.category}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <span>Open Source</span>
                        </p>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow group-hover:text-gray-300 transition-colors duration-200">
                        {alternative.description}
                    </p>

                    {/* Footer: Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                        {alternative.tags?.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="relative px-1 py-0.5 text-xs text-gray-500 hover:text-indigo-400 transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                        {alternative.tags && alternative.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-600">
                                +{alternative.tags.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Memoize to prevent unnecessary re-renders
export default memo(AlternativeCard, (prev, next) => {
    return prev.alternative.id === next.alternative.id &&
        prev.disableAnimation === next.disableAnimation;
});
