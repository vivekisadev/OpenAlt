"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<'my-tools' | 'approvals' | 'manage-tools' | 'users'>('my-tools');

    // Data states
    const [myTools, setMyTools] = useState<any[]>([]);
    const [pendingTools, setPendingTools] = useState<any[]>([]);
    const [allTools, setAllTools] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            setLoading(false);
            return;
        }

        // Set default tab for admin
        if (isAdmin && activeTab === 'my-tools') {
            setActiveTab('approvals');
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user's tools
                const userToolsRes = await fetch("/api/user/tools");
                if (userToolsRes.ok) {
                    setMyTools(await userToolsRes.json());
                }

                if (isAdmin) {
                    // Fetch pending tools
                    const pendingRes = await fetch("/api/admin/tools?filter=pending");
                    if (pendingRes.ok) {
                        setPendingTools(await pendingRes.json());
                    }

                    // Fetch all tools
                    const allToolsRes = await fetch("/api/admin/tools?filter=all");
                    if (allToolsRes.ok) {
                        setAllTools(await allToolsRes.json());
                    }

                    // Fetch users
                    const usersRes = await fetch("/api/admin/users");
                    if (usersRes.ok) {
                        setUsers(await usersRes.json());
                    }
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session, status, isAdmin]);

    const handleApproveReject = async (id: string, action: 'approve' | 'reject') => {
        let reason = "";
        if (action === 'reject') {
            reason = prompt("Enter rejection reason:") || "";
            if (!reason) return;
        }

        try {
            const res = await fetch("/api/admin/tools", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action, reason })
            });
            if (res.ok) {
                // Refresh data
                const pendingRes = await fetch("/api/admin/tools?filter=pending");
                setPendingTools(await pendingRes.json());
                const allToolsRes = await fetch("/api/admin/tools?filter=all");
                setAllTools(await allToolsRes.json());
            }
        } catch (e) {
            alert("Error processing action");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tool? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/tools?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setAllTools(allTools.filter(t => t.id !== id));
                setPendingTools(pendingTools.filter(t => t.id !== id));
                setMyTools(myTools.filter(t => t.id !== id));
            } else {
                alert("Failed to delete tool");
            }
        } catch (e) {
            alert("Error deleting tool");
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
                <p className="text-gray-400">You need to be logged in to view your dashboard.</p>
                <Link href="/submit" className="px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-colors">
                    Log In / Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 pt-32">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                        <span className={`text-xs px-2 py-1 rounded-full border ${isAdmin ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                            {isAdmin ? 'ADMIN' : 'USER'}
                        </span>
                    </h1>
                    {!isAdmin && (
                        <Link href="/submit" className="px-4 py-2 bg-indigo-600 rounded-lg font-medium hover:bg-indigo-500 transition-colors">
                            Submit New Tool
                        </Link>
                    )}
                </div>

                {/* Tabs for Admin */}
                {isAdmin && (
                    <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
                        <button
                            onClick={() => setActiveTab('approvals')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'approvals'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Pending Approvals ({pendingTools.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('manage-tools')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'manage-tools'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Manage All Tools ({allTools.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Users ({users.length})
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {/* User View: My Tools */}
                    {!isAdmin && (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {myTools.map(tool => (
                                <ToolCard key={tool.id} tool={tool} isOwner={true} />
                            ))}
                            {myTools.length === 0 && <EmptyState message="You haven't submitted any tools yet." />}
                        </div>
                    )}

                    {/* Admin View: Pending Approvals */}
                    {isAdmin && activeTab === 'approvals' && (
                        <div className="grid gap-6">
                            {pendingTools.map(tool => (
                                <AdminToolCard
                                    key={tool.id}
                                    tool={tool}
                                    onApprove={() => handleApproveReject(tool.id, 'approve')}
                                    onReject={() => handleApproveReject(tool.id, 'reject')}
                                />
                            ))}
                            {pendingTools.length === 0 && <EmptyState message="No pending approvals." />}
                        </div>
                    )}

                    {/* Admin View: Manage Tools */}
                    {isAdmin && activeTab === 'manage-tools' && (
                        <div className="grid gap-6">
                            {allTools.map(tool => (
                                <div key={tool.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <img src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-lg object-contain bg-white/5" />
                                        <div>
                                            <h3 className="font-bold text-lg">{tool.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span>by {tool.submitter?.name || 'Unknown'}</span>
                                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                <span className={tool.approved ? "text-green-400" : "text-yellow-400"}>
                                                    {tool.approved ? "Approved" : "Pending"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/item/${tool.id}`} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(tool.id)}
                                            className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {allTools.length === 0 && <EmptyState message="No tools found." />}
                        </div>
                    )}

                    {/* Admin View: Users */}
                    {isAdmin && activeTab === 'users' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                                        <th className="p-4 font-medium">User</th>
                                        <th className="p-4 font-medium">Email</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium">Tools Submitted</th>
                                        <th className="p-4 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-white">{user.name || 'N/A'}</td>
                                            <td className="p-4 text-gray-400">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-700/30 text-gray-300'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-300">{user.toolCount}</td>
                                            <td className="p-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ToolCard({ tool, isOwner }: { tool: any, isOwner?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col"
        >
            <div className="flex items-center gap-4 mb-4">
                <img src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-lg object-contain bg-white/10" />
                <div>
                    <h3 className="font-bold text-lg">{tool.name}</h3>
                    <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${tool.approved ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                            {tool.approved ? 'Approved' : 'Pending Review'}
                        </span>
                    </div>
                </div>
            </div>

            {!tool.approved && tool.rejectionReason && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                    <strong>Rejected:</strong> {tool.rejectionReason}
                </div>
            )}

            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                {tool.description}
            </p>

            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                <a
                    href={`/item/${tool.id}`}
                    className="flex-1 px-4 py-2 bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-600/30 transition-colors text-center"
                >
                    View
                </a>
            </div>
        </motion.div>
    );
}

function AdminToolCard({ tool, onApprove, onReject }: { tool: any, onApprove: () => void, onReject: () => void }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 flex-shrink-0">
                <img src={tool.logo} alt={tool.name} className="w-full h-32 object-contain bg-white/5 rounded-lg" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-400">{tool.category}</span>
                </div>
                <p className="text-gray-300 mb-4">{tool.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                    <a href={tool.url} target="_blank" className="text-indigo-400 hover:underline flex items-center gap-1">
                        Website ↗
                    </a>
                    {tool.submitter && (
                        <span className="text-gray-400">Submitted by: <span className="text-white">{tool.submitter.name}</span></span>
                    )}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onApprove}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors shadow-lg shadow-green-900/20"
                    >
                        Approve
                    </button>
                    <button
                        onClick={onReject}
                        className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors shadow-lg shadow-red-900/20"
                    >
                        Reject
                    </button>
                    <Link
                        href={`/item/${tool.id}`}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                    >
                        Preview
                    </Link>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 col-span-full">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Nothing here</h3>
            <p className="text-gray-400">{message}</p>
        </div>
    );
}
