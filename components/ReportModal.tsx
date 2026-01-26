"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Dropdown from "./Dropdown";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    toolId: string;
    toolName: string;
}

const reasonOptions = [
    { label: "Broken Link", value: "Broken Link" },
    { label: "Tool Not Working", value: "Tool Not Working" },
    { label: "Outdated Information", value: "Outdated Information" },
    { label: "Inappropriate Content", value: "Inappropriate Content" },
    { label: "Other", value: "Other" },
];

export default function ReportModal({ isOpen, onClose, toolId, toolName }: ReportModalProps) {
    const [reason, setReason] = useState(reasonOptions[0].value);
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toolId, reason, description })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                    setDescription("");
                    setReason(reasonOptions[0].value);
                }, 2000);
            } else {
                alert("Failed to submit report");
            }
        } catch (error) {
            alert("Error submitting report");
        } finally {
            setSubmitting(false);
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
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 pointer-events-auto relative shadow-2xl"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-200 to-red-400 mb-2">
                                Report Issue
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Reporting an issue with <span className="text-white font-medium">{toolName}</span>.
                            </p>

                            {success ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white font-bold mb-1">Report Sent!</h3>
                                    <p className="text-gray-400 text-sm">Thank you for helping us make OpenAlt better.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Reason</label>
                                        <Dropdown
                                            value={reason}
                                            onChange={setReason}
                                            options={reasonOptions}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
                                        <textarea
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={4}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all resize-none placeholder:text-gray-600"
                                            placeholder="Please describe the issue..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 mt-2 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            "Submit Report"
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
