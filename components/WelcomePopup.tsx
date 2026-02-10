"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PremiumButton from "./PremiumButton";

export default function WelcomePopup() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get("first_login") === "true") {
            setIsOpen(true);
            // Optionally remove the param from URL immediately or after close
            // For now, we'll keep it visible in URL as debug, but clean it up on close
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsOpen(false);
        // Clean URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("first_login");
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-[#0a0a0c] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />

                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">Welcome Aboard!</h3>
                            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                                You are now signed in. We'll keep you logged in on this browser so you can access your dashboard instantly.
                            </p>

                            <PremiumButton
                                onClick={handleClose}
                                label="Got it, thanks!"
                                variant="primary"
                                fullWidth
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
