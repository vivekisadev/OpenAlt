"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAlternatives } from "@/context/AlternativesContext";
import { signIn, signOut, useSession } from "next-auth/react";
import Dropdown from "@/components/Dropdown";

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

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!isLogin) {
                // Register flow
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(authData),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Registration failed");
                }
            }

            // Login flow
            const result = await signIn("credentials", {
                username: authData.email,
                password: authData.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error("Invalid credentials");
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsLoading(true);
        const result = await signIn("credentials", {
            username: "demo@example.com",
            password: "password123",
            redirect: false,
        });

        if (result?.error) {
            try {
                await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "Demo User",
                        email: "demo@example.com",
                        password: "password123"
                    }),
                });

                await signIn("credentials", {
                    username: "demo@example.com",
                    password: "password123",
                    redirect: false,
                });
            } catch (e) {
                alert("Could not login as demo user");
            }
        }
        setIsLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (e.g. 2MB limit for Base64 to avoid DB bloat)
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

        // Create new alternative object
        const newAlt = {
            id: formData.name.toLowerCase().replace(/\s+/g, "-"),
            name: formData.name,
            category: formData.category,
            description: formData.description,
            longDescription: formData.longDescription || formData.description,
            url: formData.url,
            githubUrl: formData.githubUrl,
            tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
            logo: formData.logo || "https://via.placeholder.com/150",
            image: formData.image, // Desktop screenshot
            features: formData.features.split(",").map(f => f.trim()).filter(f => f),
            pricing: formData.pricing,
            createdAt: new Date().toISOString(),
            rating: 0
        };

        await addAlternative(newAlt);
        setShowSuccess(true);

        // Redirect after delay
        setTimeout(() => {
            router.push("/");
        }, 1500);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (session) {
        return (
            <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 relative cursor-none flex items-center justify-center py-32">
                <div className="relative z-10 w-full max-w-5xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold">Submit a Tool</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-indigo-400 font-medium px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                    {session.user?.name || "User"}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Tool submitted successfully! It will be reviewed shortly.
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tool Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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

                            {/* URLs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Website URL *</label>
                                    <input
                                        required
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                            </div>

                            {/* Assets */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Logo URL</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.logo}
                                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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

                            {/* Descriptions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Short Description *</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    placeholder="Briefly describe what this tool does..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.longDescription}
                                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    placeholder="Provide a detailed explanation of features, use cases, etc."
                                />
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="opensource, ai, python..."
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
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Self-hosted, API access, Multi-user..."
                                />
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-900/20 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Submit Tool
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 relative cursor-none flex items-center justify-center">
            <div className="relative z-10 w-full max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6 text-gray-400 hover:text-white transition-colors">
                            ← Back to Directory
                        </Link>
                        <h1 className="text-3xl font-bold mb-2">
                            {isLogin ? "Welcome Back" : "Join the Community"}
                        </h1>
                        <p className="text-gray-400">
                            {isLogin
                                ? "Sign in to submit a new tool."
                                : "Create an account to start contributing."}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleAuth}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={authData.username}
                                    onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="johndoe"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={authData.email}
                                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={authData.password}
                                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-900/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
                        </button>
                    </form>

                    <div className="mt-6 space-y-4 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-gray-400 hover:text-white transition-colors block w-full"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#0a0a0a] text-gray-500">Or</span>
                            </div>
                        </div>

                        <button
                            onClick={handleDemoLogin}
                            disabled={isLoading}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Try as Demo User
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
