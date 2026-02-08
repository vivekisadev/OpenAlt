"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EditToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: any;
    suggestedChanges?: {
        field: string;
        suggestion: string;
        reason: string;
    }[];
    onSave?: (updatedTool: any) => void;
    isResolving?: boolean;
}

export default function EditToolModal({ isOpen, onClose, tool, suggestedChanges, onSave, isResolving }: EditToolModalProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        longDescription: "",
        url: "",
        githubUrl: "",
        category: "",
        pricing: "",
        logo: "",
        image: "",
        tags: "",
        features: "",
    });
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isResolvedChecked, setIsResolvedChecked] = useState(false);

    // Reset resolution state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setIsResolvedChecked(false);
        }
    }, [isOpen]);

    // Disable background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (tool) {
                setFormData({
                    name: tool.name || "",
                    description: tool.description || "",
                    longDescription: tool.longDescription || "",
                    url: tool.url || "",
                    githubUrl: tool.githubUrl || "",
                    category: tool.category || "",
                    pricing: tool.pricing || "",
                    logo: tool.logo || "",
                    image: tool.image || "",
                    tags: Array.isArray(tool.tags) ? tool.tags.join(", ") : (tool.tags || ""),
                    features: Array.isArray(tool.features) ? tool.features.join(", ") : (tool.features || ""),
                });
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, tool]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMessage("");

        try {
            const res = await fetch(`/api/admin/tools/${tool.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage("Tool updated successfully!");
                if (onSave) onSave(data);
                setTimeout(() => {
                    setSuccessMessage("");
                    onClose();
                    router.refresh();
                }, 1500);
            } else {
                setErrorMessage(data.message || "Failed to update tool");
            }
        } catch (error) {
            console.error("Error updating tool:", error);
            setErrorMessage("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const isSuggested = (field: string) => {
        return suggestedChanges?.some(s => s.field === field);
    };

    const getSuggestion = (field: string) => {
        return suggestedChanges?.find(s => s.field === field);
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
                        onClick={onClose}
                        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#111] border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-8 pointer-events-auto relative shadow-[0_0_100px_rgba(0,0,0,0.8)] my-8"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-400 mb-2">
                                Edit Tool
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Update tool information {suggestedChanges && suggestedChanges.length > 0 && <span className="text-yellow-400">(with {suggestedChanges.length} suggested change{suggestedChanges.length > 1 ? 's' : ''})</span>}
                            </p>

                            {successMessage ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white font-bold mb-1">{successMessage}</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col max-h-[70vh]">
                                    {/* Scrollable Content */}
                                    <div className="flex-1 overflow-y-auto pr-2 premium-scrollbar space-y-4 mb-6">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-2">
                                                Tool Name
                                                {isSuggested("name") && (
                                                    <span className="text-yellow-400 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Suggested
                                                    </span>
                                                )}
                                            </label>
                                            {isSuggested("name") && (
                                                <div className="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300">
                                                    💡 {getSuggestion("name")?.reason}
                                                </div>
                                            )}
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                className={`w-full bg-black/20 border ${isSuggested("name") ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all`}
                                                placeholder="Enter tool name"
                                            />
                                        </div>

                                        {/* URL */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-2">
                                                Website URL
                                                {isSuggested("url") && (
                                                    <span className="text-yellow-400 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Suggested
                                                    </span>
                                                )}
                                            </label>
                                            {isSuggested("url") && (
                                                <div className="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300">
                                                    💡 {getSuggestion("url")?.reason}
                                                </div>
                                            )}
                                            <input
                                                type="url"
                                                required
                                                value={formData.url}
                                                onChange={(e) => handleChange("url", e.target.value)}
                                                className={`w-full bg-black/20 border ${isSuggested("url") ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all`}
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-2">
                                                Short Description
                                                {isSuggested("description") && (
                                                    <span className="text-yellow-400 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Suggested
                                                    </span>
                                                )}
                                            </label>
                                            {isSuggested("description") && (
                                                <div className="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300">
                                                    💡 {getSuggestion("description")?.reason}
                                                </div>
                                            )}
                                            <textarea
                                                required
                                                value={formData.description}
                                                onChange={(e) => handleChange("description", e.target.value)}
                                                rows={2}
                                                className={`w-full bg-black/20 border ${isSuggested("description") ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none`}
                                                placeholder="Brief one-line description"
                                            />
                                        </div>

                                        {/* Long Description */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Detailed Description (optional)</label>
                                            <textarea
                                                value={formData.longDescription}
                                                onChange={(e) => handleChange("longDescription", e.target.value)}
                                                rows={4}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                                                placeholder="Detailed description with key features and benefits"
                                            />
                                        </div>

                                        {/* GitHub URL */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">GitHub URL (optional)</label>
                                            <input
                                                type="url"
                                                value={formData.githubUrl}
                                                onChange={(e) => handleChange("githubUrl", e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                                placeholder="https://github.com/username/repo"
                                            />
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
                                                Tags
                                                <span className="ml-2 text-gray-500 normal-case">(comma-separated)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.tags}
                                                onChange={(e) => handleChange("tags", e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                                placeholder="AI, productivity, automation"
                                            />
                                        </div>

                                        {/* Features */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
                                                Key Features
                                                <span className="ml-2 text-gray-500 normal-case">(comma-separated)</span>
                                            </label>
                                            <textarea
                                                value={formData.features}
                                                onChange={(e) => handleChange("features", e.target.value)}
                                                rows={3}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                                                placeholder="Smart automation, Cross-platform support, Real-time collaboration"
                                            />
                                        </div>

                                        {/* Category & Pricing grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.category}
                                                    onChange={(e) => handleChange("category", e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                                    placeholder="e.g., AI Tools"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Pricing</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.pricing}
                                                    onChange={(e) => handleChange("pricing", e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                                    placeholder="e.g., Free"
                                                />
                                            </div>
                                        </div>

                                        {/* Logo URL */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Logo URL (optional)</label>
                                            <input
                                                type="url"
                                                value={formData.logo}
                                                onChange={(e) => handleChange("logo", e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                                placeholder="https://example.com/logo.png"
                                            />
                                        </div>

                                        {/* Screenshot/Image URL */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Screenshot URL (optional)</label>
                                            <input
                                                type="url"
                                                value={formData.image}
                                                onChange={(e) => handleChange("image", e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                                                placeholder="https://example.com/screenshot.png"
                                            />
                                        </div>

                                        {/* Resolution Checkbox */}
                                        {isResolving && (
                                            <div className="pt-4 border-t border-white/5">
                                                <label className="flex items-start gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center h-5">
                                                        <input
                                                            type="checkbox"
                                                            checked={isResolvedChecked}
                                                            onChange={(e) => setIsResolvedChecked(e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-5 h-5 border-2 border-white/20 rounded-md peer-checked:bg-green-600 peer-checked:border-green-600 transition-all group-hover:border-white/40"></div>
                                                        <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none left-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">I have resolved the reported issue</div>
                                                        <div className="text-[11px] text-gray-500">Checking this will mark the report as resolved and notify the admins.</div>
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sticky Footer Buttons */}
                                    <div className="flex flex-col gap-4 pt-6 pb-2 border-t border-white/5 bg-[#111]/90 backdrop-blur-xl mt-auto -mx-6 px-6 sticky bottom-0 z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
                                        {/* Error Message */}
                                        {errorMessage && (
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-red-300 text-[13px] leading-snug">{errorMessage}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-white/10 active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saving || (isResolving && !isResolvedChecked)}
                                                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed active:scale-95"
                                            >
                                                {saving ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    "Save Changes"
                                                )}
                                            </button>
                                        </div>
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
