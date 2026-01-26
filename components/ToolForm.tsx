"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Dropdown from "@/components/Dropdown";

const categoryOptions = [
    { label: "Image Generation", value: "Image Generation" },
    { label: "Chatbot", value: "Chatbot" },
    { label: "Audio", value: "Audio" },
    { label: "Video", value: "Video" },
    { label: "3D", value: "3D" },
    { label: "Dev Tools", value: "Dev Tools" },
    { label: "LLM", value: "LLM" },
    { label: "Game Dev", value: "Game Dev" },
];

const pricingOptions = [
    { label: "Free / Open Source", value: "Free / Open Source" },
    { label: "Free Tier Available", value: "Free Tier Available" },
    { label: "Paid", value: "Paid" },
    { label: "Enterprise", value: "Enterprise" },
];

interface ToolFormData {
    name: string;
    category: string;
    description: string;
    longDescription: string;
    url: string;
    githubUrl: string;
    logo: string;
    image: string;
    tags: string;
    features: string;
    pricing: string;
}

interface ToolFormProps {
    initialData?: ToolFormData;
    onSubmit: (data: ToolFormData) => Promise<void>;
    isEditing?: boolean;
    onCancel?: () => void;
}

export default function ToolForm({ initialData, onSubmit, isEditing = false, onCancel }: ToolFormProps) {
    const [formData, setFormData] = useState<ToolFormData>({
        name: "",
        category: "",
        description: "",
        longDescription: "",
        url: "",
        githubUrl: "",
        logo: "",
        image: "",
        tags: "",
        features: "",
        pricing: "Free / Open Source",
    });

    const [uploading, setUploading] = useState({
        logo: false,
        image: false
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("File size must be less than 2MB");
            return;
        }

        setUploading(prev => ({ ...prev, [field]: true }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            setUploading(prev => ({ ...prev, [field]: false }));
        };
        reader.onerror = () => {
            alert("Failed to read file");
            setUploading(prev => ({ ...prev, [field]: false }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Submit error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Information Card */}
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                            General Information
                        </h3>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Tool Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="e.g. SuperGen AI"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Category</label>
                                    <Dropdown
                                        value={formData.category}
                                        onChange={(val) => setFormData({ ...formData, category: val })}
                                        options={categoryOptions}
                                        placeholder="Select Category"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Pricing Model</label>
                                    <Dropdown
                                        value={formData.pricing}
                                        onChange={(val) => setFormData({ ...formData, pricing: val })}
                                        options={pricingOptions}
                                        placeholder="Select Pricing"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Short Description</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none placeholder:text-gray-600"
                                    placeholder="Brief summary used in cards (max 150 chars)"
                                    maxLength={150}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Detailed Description</label>
                                <textarea
                                    rows={6}
                                    value={formData.longDescription}
                                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none placeholder:text-gray-600"
                                    placeholder="Full explanation of features, use cases, and benefits..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Links & Metadata */}
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                            Links & Metadata
                        </h3>

                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Website URL</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        </div>
                                        <input
                                            required
                                            type="url"
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">GitHub URL (Optional)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                        </div>
                                        <input
                                            type="url"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                            placeholder="https://github.com/user/repo"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Tags</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="ai, python, image-generation (comma separated)"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Key Features</label>
                                <input
                                    type="text"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="Real-time, API Access, Multi-user (comma separated)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Media & Actions */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Media Uploads */}
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                Media
                            </h3>

                            <div className="space-y-6">
                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Logo / Icon</label>
                                    <div className="relative group">
                                        <div className={`w-full aspect-square rounded-xl bg-black/20 border-2 border-dashed ${formData.logo ? 'border-white/10' : 'border-white/20 hover:border-indigo-500/50'} flex flex-col items-center justify-center transition-all overflow-hidden relative`}>
                                            {formData.logo ? (
                                                <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <span className="text-xs text-gray-500">Click to upload logo</span>
                                                </div>
                                            )}
                                            {uploading.logo && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'logo')}
                                            />
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className="text-[10px] text-gray-500">Recommended: Square, 512x512</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshot Upload */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Screenshot / Preview</label>
                                    <div className="relative group">
                                        <div className={`w-full aspect-video rounded-xl bg-black/20 border-2 border-dashed ${formData.image ? 'border-white/10' : 'border-white/20 hover:border-indigo-500/50'} flex flex-col items-center justify-center transition-all overflow-hidden relative`}>
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <span className="text-xs text-gray-500">Click to upload screenshot</span>
                                                </div>
                                            )}
                                            {uploading.image && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'image')}
                                            />
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className="text-[10px] text-gray-500">Recommended: 16:9 Aspect Ratio</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>{isEditing ? 'Save Changes' : 'Submit Tool'}</span>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    </>
                                )}
                            </button>

                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition-all border border-white/10"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
