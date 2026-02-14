"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PremiumButton from "@/components/PremiumButton";
import PasswordInput from "@/components/ui/password-input";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        currentPassword: "",
        newPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: "Profile updated successfully" });
                // Update session
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.name,
                        email: formData.email,
                    }
                });
                setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
            } else {
                setMessage({ type: 'error', text: data.message || "Something went wrong" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        if (typeof window !== 'undefined') router.push("/submit");
        return null;
    }

    return (
        <div className="min-h-screen bg-[#030014] text-white pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-600/10 blur-[130px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl mx-auto relative z-10"
            >
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 mb-2">Account Settings</h1>
                    <p className="text-gray-400">Manage your profile details and security preferences.</p>
                </div>

                <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-indigo-500/5">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                        >
                            {message.type === 'success' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            {message.text}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Profile Information</h3>
                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#121215] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-700"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#121215] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-700"

                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-2">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Security</h3>
                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl mb-4">
                                <p className="text-sm text-indigo-300">Leave these fields blank if you don't want to change your password.</p>
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <PasswordInput
                                        label="Current Password"
                                        value={formData.currentPassword}
                                        onChange={(val) => setFormData({ ...formData, currentPassword: val })}
                                        showStrength={false}
                                        className="bg-[#121215]"
                                    />
                                </div>
                                <div>
                                    <PasswordInput
                                        label="New Password"
                                        value={formData.newPassword}
                                        onChange={(val) => setFormData({ ...formData, newPassword: val })}
                                        showStrength={true}
                                        className="bg-[#121215]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex justify-end border-t border-white/10">
                            <PremiumButton
                                type="submit"
                                disabled={loading}
                                label={loading ? "Saving Changes..." : "Save Changes"}
                                variant="primary"
                                className="shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40"
                                icon={loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                            />
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
