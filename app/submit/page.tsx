"use strict";
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAlternatives } from "@/context/AlternativesContext";
import { signIn, signOut, useSession } from "next-auth/react";
import Dropdown from "@/components/Dropdown";
import PremiumButton from "@/components/PremiumButton";
import SignInForm from "@/components/ruixen/sign-in-form";
import CreateAccountForm from "@/components/ruixen/create-account-form";
import { MultiSelect } from "@/components/multi-selector";

export default function SubmitPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { addAlternative } = useAlternatives();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        longDescription: "",
        url: "",
        githubUrl: "",
        logo: "",
        image: "", // Desktop screenshot
        tags: "",
        features: "",
        pricing: "Free / Open Source",
    });

    const [uploading, setUploading] = useState({
        logo: false,
        image: false
    });

    const [authData, setAuthData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fetcingMeta, setFetchingMeta] = useState(false);

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

    const tagOptions = [
        { label: "Open Source", value: "opensource" },
        { label: "AI", value: "ai" },
        { label: "Python", value: "python" },
        { label: "JavaScript", value: "javascript" },
        { label: "React", value: "react" },
        { label: "Next.js", value: "nextjs" },
        { label: "Machine Learning", value: "machine-learning" },
        { label: "Data Science", value: "data-science" },
        { label: "DevOps", value: "devops" },
        { label: "Web Development", value: "web-development" },
        { label: "Mobile", value: "mobile" },
        { label: "Design", value: "design" },
        { label: "Productivity", value: "productivity" },
    ];

    const pricingOptions = [
        { label: "Free / Open Source", value: "Free / Open Source" },
        { label: "Free Tier Available", value: "Free Tier Available" },
        { label: "Paid", value: "Paid" },
        { label: "Enterprise", value: "Enterprise" },
    ];

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null); // Clear previous errors

        try {
            if (!isLogin) {
                // Register flow (Local DB)
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(authData),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Registration failed");
                }

                // Direct login after registration
                const result = await signIn("credentials", {
                    username: authData.email,
                    password: authData.password,
                    redirect: false,
                });

                if (result?.error) {
                    throw new Error("Registration successful, but auto-login failed.");
                } else {
                    router.push("/?first_login=true");
                    router.refresh();
                }
            } else {
                // Login flow
                const result = await signIn("credentials", {
                    username: authData.email,
                    password: authData.password,
                    redirect: false,
                });

                if (result?.error) {
                    throw new Error("Invalid credentials. Please check your email and password.");
                } else {
                    router.push("/");
                    router.refresh();
                }
            }
        } catch (error: any) {
            setErrorMessage(error.message);
            setIsLoading(false); // Only stop loading on error, otherwise we are redirecting
        }
    };

    const handleDemoLogin = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            // Attempt 1: Direct Login
            let result = await signIn("credentials", {
                username: "demo@example.com",
                password: "password123",
                redirect: false,
            });

            // If login fails (user doesn't exist), register then login
            if (result?.error) {
                await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "Demo User",
                        email: "demo@example.com",
                        password: "password123"
                    }),
                });

                result = await signIn("credentials", {
                    username: "demo@example.com",
                    password: "password123",
                    redirect: false,
                });
            }

            if (result?.error) {
                throw new Error("Demo login failed");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (e) {
            setErrorMessage("Could not login as demo user");
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (e.g. 2MB limit for Base64 to avoid DB bloat)
        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage("File size must be less than 2MB");
            return;
        }

        setUploading(prev => ({ ...prev, [field]: true }));
        setErrorMessage(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            setUploading(prev => ({ ...prev, [field]: false }));
        };
        reader.onerror = () => {
            setErrorMessage("Failed to read file");
            setUploading(prev => ({ ...prev, [field]: false }));
        };
        reader.readAsDataURL(file);
    };

    // New: Fetch Metadata from URL
    const handleFetchMetadata = async () => {
        if (!formData.url) {
            setErrorMessage("Please enter a URL first to auto-fill details.");
            return;
        }

        // Basic URL validation
        try {
            new URL(formData.url);
        } catch {
            setErrorMessage("Please enter a valid URL (e.g., https://example.com)");
            return;
        }

        setFetchingMeta(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`/api/metadata?url=${encodeURIComponent(formData.url)}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setFormData(prev => ({
                ...prev,
                name: data.title ? (data.title.length > 50 ? data.title.substring(0, 50) : data.title) : prev.name,
                description: data.description ? (data.description.length > 150 ? data.description.substring(0, 150) + "..." : data.description) : prev.description,
                longDescription: data.description || prev.longDescription,
                image: data.image || prev.image,
                logo: data.logo || prev.logo
            }));
        } catch (error: any) {
            console.error(error);
            setErrorMessage("Could not fetch metadata. Please fill manually.");
        } finally {
            setFetchingMeta(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null); // Clear previous errors

        // Create new alternative object
        const newAlt = {
            id: formData.name.toLowerCase().replace(/\s+/g, "-"),
            name: formData.name,
            category: formData.category,
            description: formData.description,
            longDescription: formData.longDescription || formData.description,
            url: formData.url,
            githubUrl: formData.githubUrl,
            tags: formData.tags, // Pass raw string, will be handled by context/API
            logo: formData.logo || "https://via.placeholder.com/150",
            image: formData.image, // Desktop screenshot
            features: formData.features, // Pass raw string
            pricing: formData.pricing,
            createdAt: new Date().toISOString(),
            rating: 0
        };

        try {
            await addAlternative(newAlt as any);
            setShowSuccess(true);

            // Redirect after delay
            setTimeout(() => {
                router.push("/");
            }, 1500);
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to submit tool");
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#030014] text-white font-sans flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // SUBMIT FORM (Logged In)
    if (session) {
        return (
            <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-indigo-500/30 relative flex items-center justify-center py-32">
                {/* Premium Background Ambience */}
                <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />

                <div className="relative z-10 w-full max-w-5xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#0A0A0A] border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
                    >
                        {/* Shine Effect */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] pointer-events-none" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Submit a Tool</h1>
                                <p className="text-gray-400 mt-2">Share a new AI tool with the community.</p>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/5">
                                <div className="flex items-center gap-2 px-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm text-gray-300 font-medium">
                                        {session.user?.name || "User"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {/* Error Message Display */}
                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3"
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium">{errorMessage}</span>
                                </motion.div>
                            )}

                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Tool submitted successfully! It will be reviewed shortly.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* URLs Section - First for Auto-Fill */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-6">
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 1: Link & Metadata</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Website URL *</label>
                                        <div className="flex gap-2">
                                            <input
                                                required
                                                type="url"
                                                value={formData.url}
                                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                                                placeholder="https://example.com"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleFetchMetadata}
                                                disabled={fetcingMeta || !formData.url}
                                                className="px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                                                title="Auto-fill details from URL"
                                            >
                                                {fetcingMeta ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                )}
                                                <span className="hidden sm:inline text-xs font-bold">Auto-Fill</span>
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-2">Enter URL and click 'Auto-Fill' to fetch title, description, and logo automatically.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                                        <input
                                            type="url"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                                            placeholder="https://github.com/username/repo"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-6">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 2: Basic Details</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Tool Name *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                                            placeholder="e.g. SuperGen AI"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                                        <Dropdown
                                            value={formData.category}
                                            onChange={(val) => setFormData({ ...formData, category: val })}
                                            options={categoryOptions}
                                            placeholder="Select a category"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-6">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 3: Description</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Short Description *</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none"
                                        placeholder="Briefly describe what this tool does..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Description</label>
                                    <textarea
                                        rows={6}
                                        value={formData.longDescription}
                                        onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-y"
                                        placeholder="Provide a detailed explanation of features, use cases, pricing tiers, and why it's a great alternative."
                                    />
                                    <p className="text-[10px] text-gray-500 mt-2">A good description helps users understand your tool better. Use the Auto-Fill button to get a head start.</p>
                                </div>
                            </div>

                            {/* Assets */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-6">
                                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Step 4: Media</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Logo URL</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.logo}
                                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                                                placeholder="https://example.com/logo.png"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('logo-upload')?.click()}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                                                title="Upload Image"
                                                disabled={uploading.logo}
                                            >
                                                {uploading.logo ? (
                                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                )}
                                            </button>
                                            <input
                                                type="file"
                                                id="logo-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'logo')}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Desktop Screenshot URL</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                                                placeholder="https://example.com/screenshot.png"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                                                title="Upload Image"
                                                disabled={uploading.image}
                                            >
                                                {uploading.image ? (
                                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                )}
                                            </button>
                                            <input
                                                type="file"
                                                id="image-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'image')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                                    <MultiSelect
                                        options={tagOptions}
                                        onValueChange={(selected) => setFormData({ ...formData, tags: selected.join(", ") })}
                                        defaultValue={formData.tags ? formData.tags.split(", ").filter(t => t) : []}
                                        placeholder="Select tags"
                                        animation={2}
                                        maxCount={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Pricing</label>
                                    <Dropdown
                                        value={formData.pricing}
                                        onChange={(val) => setFormData({ ...formData, pricing: val })}
                                        options={pricingOptions}
                                        placeholder="Select pricing"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Features (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                                    placeholder="Self-hosted, API access, Multi-user..."
                                />
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-end">
                                <PremiumButton
                                    type="submit"
                                    label="Submit Tool"
                                    variant="primary"
                                    icon={
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    }
                                    className="px-8 py-3 text-lg"
                                />
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        );
    }

    // LOGIN / SIGNUP UI
    return (
        <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-indigo-500/30 relative flex items-center justify-center p-4 pt-24">
            {/* Subtle Ambient Background */}
            <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none opacity-50" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none opacity-50" />

            {/* Auth Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-[420px]"
            >
                {isLogin ? (
                    <SignInForm
                        email={authData.email}
                        setEmail={(val: string) => setAuthData({ ...authData, email: val })}
                        password={authData.password}
                        setPassword={(val: string) => setAuthData({ ...authData, password: val })}
                        onSubmit={handleAuth}
                        onDemoLogin={handleDemoLogin}
                        onToggleMode={() => {
                            setIsLogin(false);
                            setErrorMessage(null);
                        }}
                        isLoading={isLoading}
                        error={errorMessage}
                    />
                ) : (
                    <CreateAccountForm
                        username={authData.username}
                        setUsername={(val: string) => setAuthData({ ...authData, username: val })}
                        email={authData.email}
                        setEmail={(val: string) => setAuthData({ ...authData, email: val })}
                        password={authData.password}
                        setPassword={(val: string) => setAuthData({ ...authData, password: val })}
                        onSubmit={handleAuth}
                        onToggleMode={() => {
                            setIsLogin(true);
                            setErrorMessage(null);
                        }}
                        isLoading={isLoading}
                        error={errorMessage}
                    />
                )}
            </motion.div>
        </div>
    );
}
