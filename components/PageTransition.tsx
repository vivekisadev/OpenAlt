'use client';

import { motion } from 'framer-motion';

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    // Stagger animation for the 5 columns
    const shuffleTransition = {
        initial: {
            height: '100%',
        },
        animate: (i: number) => ({
            height: '0%',
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // Custom bezier for premium feel
                delay: i * 0.05, // Stagger effect
            },
        }),
    };

    // Content fade-in animation
    const contentTransition = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3, // Wait for shutters to start opening
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col md:flex-row h-screen w-screen">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={shuffleTransition}
                        initial="initial"
                        animate="animate"
                        exit="initial"
                        className="w-full h-full bg-neutral-900 border-r border-neutral-800 last:border-r-0"
                        style={{ transformOrigin: 'top' }}
                    />
                ))}
            </div>

            <motion.div
                variants={contentTransition}
                initial="initial"
                animate="animate"
                className="w-full"
            >
                {children}
            </motion.div>
        </>
    );
}
