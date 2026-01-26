"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
        router.push("/submit");
        return null;
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                            <p className="text-sm text-gray-500 mb-6">Leave blank if you don't want to change your password.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        placeholder="Required to change password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
