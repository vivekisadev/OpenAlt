"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PopupState = "hidden" | "modal" | "minimized";

export default function GitHubStarPopup() {
    const [viewState, setViewState] = useState<PopupState>("hidden");
    // Hardcoded for now or import from config
    const githubUrl = "https://github.com/vivekisadev/OpenAlt";

    useEffect(() => {
        // Show popup every 40 seconds
        const interval = setInterval(() => {
            // Only open if currently hidden or minimized?
            // User requirement: "popup after evey 40 sec".
            // If already minimized, maybe reopen? Or just if hidden?
            // Simple logic: If hidden, show modal.
            setViewState(prev => prev === "hidden" ? "modal" : prev);
        }, 40000);

        return () => clearInterval(interval);
    }, []);

    const handleClose = () => {
        setViewState("minimized");
    };

    const handleMaximize = () => {
        setViewState("modal");
    };

    return (
        <AnimatePresence mode="wait">
            {viewState === "modal" && (
                <motion.div
                    key="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Modal */}
                    <motion.div
                        key="modal-content"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
                    >
                        {/* Gloss Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Close/Minimize Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            title="Minimize"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.337-3.369-1.337-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Enjoying OpenAlt?</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Support us by starring our repository on GitHub. It helps us grow!
                                </p>
                            </div>

                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleClose}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 duration-200"
                            >
                                <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Star on GitHub
                            </a>

                            <button
                                onClick={handleClose}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                Minimize
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {viewState === "minimized" && (
                <motion.div
                    key="minimized-fab"
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    className="fixed bottom-36 right-6 z-[49] flex flex-col items-end gap-2"
                >
                    {/* Tooltip */}
                    <div className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg mb-1 whitespace-nowrap opacity-0 animate-in fade-in slide-in-from-right-2 duration-300 fill-mode-forwards delay-1000">
                        Star us! ⭐
                    </div>

                    <button
                        onClick={handleMaximize}
                        className="w-12 h-12 bg-[#0A0A0A] border border-white/10 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 hover:border-white/20 transition-all group"
                    >
                        <svg className="w-6 h-6 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.337-3.369-1.337-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
