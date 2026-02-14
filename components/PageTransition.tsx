"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);

    // Simulate a loading bar on route change
    useEffect(() => {
        // Start progress
        setProgress(30);

        // Trickle
        const timer1 = setTimeout(() => setProgress(70), 200);
        const timer2 = setTimeout(() => setProgress(100), 500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [pathname]);

    return (
        <div className="min-h-screen bg-[#050608] text-white w-full relative selection:bg-indigo-500/30">
            {/* Top Loading Bar */}
            <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none">
                <motion.div
                    initial={{ width: "0%", opacity: 1 }}
                    animate={{
                        width: `${progress}%`,
                        opacity: progress === 100 ? 0 : 1
                    }}
                    transition={{
                        width: { duration: 0.4, ease: "easeOut" },
                        opacity: { duration: 0.3, delay: 0.2 }
                    }}
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                />
            </div>

            {/* Content Fade In (No Exit Animation to prevent scroll jumping) */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                }}
                className="w-full min-h-screen flex flex-col"
            >
                {children}
            </motion.div>
        </div>
    );
}
