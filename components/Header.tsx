"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import PremiumButton from "./PremiumButton"; // Preserve this component
import SettingsModal from "./SettingsModal";
import Tooltip from "./Tooltip";

export const Header = () => {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [stars, setStars] = useState<number | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const pathname = usePathname();

    const githubRepo = "https://github.com/vivekisadev/OpenAlt";

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            // Use a slightly larger threshold for smoothness
            setIsScrolled(window.scrollY > 30);
        };
        handleScroll(); // Check on mount
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch GitHub stars
    useEffect(() => {
        fetch("https://api.github.com/repos/vivekisadev/OpenAlt")
            .then(res => res.json())
            .then(data => {
                if (data.stargazers_count) setStars(data.stargazers_count);
            })
            .catch(err => console.error("Failed to fetch stars", err));
    }, []);

    // Handle page changes if needed (optional cleanup)
    useEffect(() => {
        // Any reset logic
    }, [pathname]);

    const navLinks = [
        { name: "Search", href: "/search" },
        { name: "Category", href: "/category" },
        { name: "Tag", href: "/tag" },
        { name: "Blog", href: "/blog" },
    ];

    if (session) {
        navLinks.push({ name: "Dashboard", href: "/dashboard" });
    }

    // Determine width and styles based on state
    const getWidth = () => {
        if (isScrolled) return "fit-content"; // Shrink to content (pill)
        return "min(90%, 1280px)"; // Full width (with constraint)
    };

    // We'll use a fixed max-width constraint for the pill to ensure it doesn't get too small or weird
    // Using simple conditional classes for layout wrapper

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none ${isScrolled ? "pt-4" : "pt-6"}`}
        >
            <motion.div
                layout // Enable smooth layout animation (FLIP) for width/padding changes
                initial={false}
                style={{
                    width: isScrolled ? "fit-content" : "min(90%, 1000px)", // Controlled by style+layout
                    padding: isScrolled ? "0.5rem 1.25rem" : "0.75rem 2rem",
                    gap: isScrolled ? "1.5rem" : "0rem",
                    pointerEvents: "auto"
                }}
                animate={{
                    backgroundColor: isScrolled ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)",
                    borderColor: "rgba(255,255,255,0.1)",
                }}
                transition={{
                    duration: 1.0, // Slower, premium speed
                    ease: [0.16, 1, 0.3, 1],
                    layout: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } // Specific layout transition
                }}
                className={`
                    flex items-center
                    backdrop-blur-xl
                    border
                    rounded-full
                    shadow-lg
                    mx-4
                    justify-between
                `}
            // Note: Changing justify-between to justify-center via class might jump.
            // But if width shrinks to fit-content, it effectively centers. 
            // We'll keep 'justify-between' for consistent layout logic inside, 
            // but since width is 'fit-content' on scroll, space-between has no space to distribute :)
            >
                {/* Logo Section */}
                <motion.div
                    className="flex items-center shrink-0"
                    animate={{
                        scale: 1,
                        rotate: 0
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-green-500 font-bold text-xl">/</span>
                        <span className="font-bold text-xl tracking-tight text-white hidden sm:block transition-opacity opacity-100">
                            OpenAlt
                        </span>
                    </Link>
                </motion.div>

                {/* Nav Links */}
                <motion.div className="flex items-center gap-1 sm:gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`
                                relative px-3 py-1.5 text-sm font-medium transition-colors rounded-full
                                ${pathname === link.href ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}
                            `}
                        >
                            {link.name}
                        </Link>
                    ))}
                </motion.div>

                {/* Right Actions */}
                <motion.div className="flex items-center gap-3 whitespace-nowrap shrink-0">
                    {/* GitHub Star Badge (Premium) */}
                    <Tooltip content="Star on Github">
                        <a
                            href={githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.337-3.369-1.337-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            <div className="w-px h-3 bg-white/10" />
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors tabular-nums">
                                    {stars ? stars.toLocaleString() : "..."}
                                </span>
                            </div>
                        </a>
                    </Tooltip>

                    {/* Premium/Dashboard Button */}
                    <div className="hidden sm:block">
                        {session ? (
                            <div className="relative group">
                                <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/20 relative z-10">
                                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                                </Link>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0">
                                    <div className="bg-[#0a0a0c] border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl">
                                        <div className="px-4 py-3 border-b border-white/5">
                                            <p className="text-xs text-gray-400">Signed in as</p>
                                            <p className="text-sm font-medium text-white truncate">{session.user?.name || "User"}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsSettingsOpen(true)}
                                            className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            Settings
                                        </button>
                                        <button
                                            onClick={() => signOut()}
                                            className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Tooltip content="Sign in to your account">
                                <PremiumButton
                                    label="Sign In"
                                    size="sm"
                                    onClick={() => signIn()}
                                />
                            </Tooltip>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </motion.header>
    );
};
