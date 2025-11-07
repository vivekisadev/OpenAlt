"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-indigo-500/30 relative cursor-none">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                        Blog Coming Soon
                    </h1>
                    <p className="text-gray-400 text-xl mb-8">
                        We're working on some amazing content for you. Stay tuned!
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
