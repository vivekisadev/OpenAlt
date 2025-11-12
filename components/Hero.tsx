"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center px-4 pt-32 pb-20">

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-gray-300 tracking-wide">
                    v2.0 Now Live
                </span>
            </motion.div>

            {/* Main Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-5xl mx-auto"
            >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9]">
                    Open Source <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                        Revolution.
                    </span>
                </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
            >
                Ditch the monthly subscriptions. Discover powerful, community-driven alternatives to the SaaS tools you use every day.
            </motion.p>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center gap-4"
            >
                <Link
                    href="/search"
                    className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                    Explore Directory
                </Link>
                <Link
                    href="/submit"
                    className="px-8 py-4 rounded-full bg-white/5 text-white font-medium text-lg border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md"
                >
                    Submit a Tool
                </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-20 grid grid-cols-3 gap-8 md:gap-20 border-t border-white/5 pt-8"
            >
                <div>
                    <div className="text-3xl font-bold text-white mb-1">500+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Tools</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mb-1">10k+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Monthly Users</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mb-1">100%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Free & Open</div>
                </div>
            </motion.div>
        </div>
    );
}
