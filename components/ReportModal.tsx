"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    toolId: string;
    toolName: string;
}

const reportTypes = [
    "Broken Link",
    "Wrong Category",
    "Outdated",
    "Other"
];

export default function ReportModal({ isOpen, onClose, toolId, toolName }: ReportModalProps) {
    const [reason, setReason] = useState(reportTypes[0]);
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Disable background scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage("");

        try {
            const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toolId, reason, description, email })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                    setDescription("");
                    setEmail("");
                    setReason(reportTypes[0]);
                }, 2000);
            } else {
                setErrorMessage(data.message || "Failed to submit report. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            setErrorMessage("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Textured Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-[#000000]/80 backdrop-blur-sm"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                                -45deg,
                                rgba(255, 255, 255, 0.03) 0px,
                                rgba(255, 255, 255, 0.03) 1px,
                                transparent 1px,
                                transparent 10px
                            )`
                        }}
                    />

                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                            className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl w-full max-w-md pointer-events-auto relative shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            {/* Subtle Top Highlight */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                            {/* Header */}
                            <div className="p-6 pb-4 border-b border-white/[0.06]">
                                <div className="flex justify-between items-start mb-1">
                                    <h2 className="text-lg font-bold text-white tracking-tight">Report Issue</h2>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Help us improve by reporting an issue with <span className="text-white font-medium">{toolName}</span>.
                                </p>
                            </div>

                            {success ? (
                                <div className="p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                                    <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Report Submitted</h3>
                                    <p className="text-gray-400 text-sm max-w-[200px]">Thank you for helping us maintain the directory.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                                            Your Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all placeholder:text-gray-700"
                                        />
                                    </div>

                                    {/* Type Selection */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                                            Issue Type <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {reportTypes.map((type) => (
                                                <label
                                                    key={type}
                                                    className={`
                                                        relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
                                                        ${reason === type
                                                            ? "bg-white/[0.08] border-white/20 text-white"
                                                            : "bg-white/[0.02] border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-gray-300"
                                                        }
                                                    `}
                                                >
                                                    <div className={`
                                                        w-4 h-4 rounded-full border flex items-center justify-center
                                                        ${reason === type ? "border-white" : "border-gray-600"}
                                                    `}>
                                                        {reason === type && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="reason"
                                                        value={type}
                                                        checked={reason === type}
                                                        onChange={() => setReason(type)}
                                                        className="hidden"
                                                    />
                                                    <span className="text-xs font-medium">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message Field */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                                            Details
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={3}
                                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all resize-none placeholder:text-gray-700"
                                            placeholder="Please describe the issue..."
                                        />
                                    </div>

                                    {errorMessage && (
                                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs font-medium">{errorMessage}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-3 bg-transparent border border-white/[0.08] text-gray-300 font-medium rounded-xl hover:bg-white/[0.05] hover:text-white transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                        >
                                            {submitting ? (
                                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
                                            ) : (
                                                "Submit Report"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
