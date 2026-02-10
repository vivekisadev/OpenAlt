"use client";

import { motion, AnimatePresence } from "framer-motion";
import PremiumButton from "./PremiumButton";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface SignupConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onVerified: () => void; // Callback to trigger local login/registration
}

export default function SignupConfirmationModal({ isOpen, onClose, email, onVerified }: SignupConfirmationModalProps) {
    const [view, setView] = useState<"info" | "otp">("info");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerifyOtp = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: "signup" // or 'recovery' or 'magiclink' depending on flow, but 'signup' works for initial verification
            });

            if (error) throw error;

            // Success
            onVerified();
        } catch (err: any) {
            setError(err.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email: email,
            });
            if (error) throw error;
            alert("Verification email resent!");
        } catch (err: any) {
            setError(err.message || "Failed to resend");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                            className="pointer-events-auto w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
                        >
                            {/* Background Effects */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px]" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px]" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                    <svg
                                        className="w-10 h-10 text-indigo-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>

                                {/* Message */}
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    We've sent a 6-digit confirmation code to <br />
                                    <span className="text-white font-medium">{email}</span>
                                </p>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 w-full">
                                        {error}
                                    </div>
                                )}

                                {/* OTP Input */}
                                <div className="w-full mb-6">
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2 text-left w-full pl-1">
                                        Enter Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700 placeholder:tracking-normal"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 w-full">
                                    <PremiumButton
                                        onClick={handleVerifyOtp}
                                        disabled={loading || otp.length < 6}
                                        label={loading ? "Verifying..." : "Verify & Sign In"}
                                        variant="primary"
                                        fullWidth
                                    />
                                    <PremiumButton
                                        onClick={onClose}
                                        disabled={loading}
                                        label="Cancel"
                                        variant="secondary"
                                        className="text-gray-500 hover:text-white bg-transparent border-transparent"
                                        fullWidth
                                    />
                                </div>

                                <p className="mt-6 text-xs text-gray-500">
                                    Did not receive the email?
                                    <button
                                        onClick={handleResend}
                                        disabled={loading}
                                        className="ml-1 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                                    >
                                        Resend
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
