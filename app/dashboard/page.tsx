"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PremiumButton from "@/components/PremiumButton";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import EditToolModal from "@/components/EditToolModal";
import SpotlightCard from "@/components/SpotlightCard";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<'my-tools' | 'approvals' | 'manage-tools' | 'users' | 'reports'>('my-tools');

    // Data states
    const [myTools, setMyTools] = useState<any[]>([]);
    const [pendingTools, setPendingTools] = useState<any[]>([]);
    const [allTools, setAllTools] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingTool, setEditingTool] = useState<any>(null);
    const [activeReportId, setActiveReportId] = useState<string | null>(null);

    // Admin Search State
    const [adminSearch, setAdminSearch] = useState("");

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
                // Fetch all data in parallel for faster loading
                const promises = [
                    fetch("/api/user/tools").then(res => res.ok ? res.json() : []),
                    fetch("/api/reports").then(res => res.ok ? res.json() : [])
                ];

                if (isAdmin) {
                    promises.push(
                        fetch("/api/admin/tools?filter=pending").then(res => res.ok ? res.json() : []),
                        fetch("/api/admin/tools?filter=all").then(res => res.ok ? res.json() : []),
                        fetch("/api/admin/users").then(res => res.ok ? res.json() : [])
                    );
                }

                const results = await Promise.all(promises);

                setMyTools(results[0]);
                setReports(results[1]);

                if (isAdmin) {
                    setPendingTools(results[2]);
                    setAllTools(results[3]);
                    setUsers(results[4]);
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
        try {
            // Optimistic update - remove from pending immediately
            setPendingTools(prev => prev.filter(t => t.id !== id));

            const res = await fetch(`/api/admin/tools?id=${id}&action=${action}`, {
                method: "PATCH"
            });

            if (res.ok) {
                const updatedTool = await res.json();
                // Update allTools list with the updated tool
                if (action === 'approve') {
                    setAllTools(prev => prev.map(t => t.id === id ? updatedTool : t));
                } else {
                    // Remove rejected tool from all tools
                    setAllTools(prev => prev.filter(t => t.id !== id));
                }
            } else {
                // Rollback on error - refetch pending tools
                const pendingRes = await fetch("/api/admin/tools?filter=pending");
                if (pendingRes.ok) setPendingTools(await pendingRes.json());
            }
        } catch (e) {
            console.error("Error processing action:", e);
            // Rollback on error
            const pendingRes = await fetch("/api/admin/tools?filter=pending");
            if (pendingRes.ok) setPendingTools(await pendingRes.json());
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // Optimistic update - remove immediately
            const originalAllTools = [...allTools];
            const originalPendingTools = [...pendingTools];
            const originalMyTools = [...myTools];

            setAllTools(prev => prev.filter(t => t.id !== id));
            setPendingTools(prev => prev.filter(t => t.id !== id));
            setMyTools(prev => prev.filter(t => t.id !== id));
            setDeletingToolId(null); // Clear delete confirmation

            const res = await fetch(`/api/admin/tools?id=${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                // Rollback on error
                setAllTools(originalAllTools);
                setPendingTools(originalPendingTools);
                setMyTools(originalMyTools);
            }
        } catch (e) {
            console.error("Error deleting tool:", e);
        }
    };

    const handleUpdateReport = async (reportId: string, status: string, adminNotes?: string) => {
        try {
            const res = await fetch("/api/reports", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId, status, adminNotes })
            });
            if (res.ok) {
                // Refresh reports
                const reportsRes = await fetch("/api/reports");
                if (reportsRes.ok) {
                    setReports(await reportsRes.json());
                }
            } else {
                alert("Failed to update report");
            }
        } catch (e) {
            alert("Error updating report");
        }
    };

    // Edit tool handlers
    const handleOpenEdit = (tool: any) => {
        setEditingTool(tool);
        setEditModalOpen(true);
    };

    const handleResolveReport = (report: any) => {
        setEditingTool(report.tool);
        setActiveReportId(report.id);
        setEditModalOpen(true);
    };

    const handleSaveTool = async (updatedTool: any) => {
        // Format tool to match expected state structure
        const formattedTool = {
            ...updatedTool,
            tags: typeof updatedTool.tags === 'string' ? updatedTool.tags.split(',').map((t: string) => t.trim()) : updatedTool.tags,
            features: typeof updatedTool.features === 'string' ? updatedTool.features.split(',').map((f: string) => f.trim()) : updatedTool.features,
            submitter: updatedTool.user || updatedTool.submitter
        };

        // Update tool in all relevant lists
        setAllTools(prev => prev.map(t => t.id === formattedTool.id ? formattedTool : t));
        setMyTools(prev => prev.map(t => t.id === formattedTool.id ? formattedTool : t));
        setPendingTools(prev => prev.map(t => t.id === formattedTool.id ? formattedTool : t));

        // If user edited and tool went back to pending, add to pending list
        if (!formattedTool.approved && !isAdmin) {
            setPendingTools(prev => {
                const exists = prev.find(t => t.id === formattedTool.id);
                return exists ? prev : [...prev, formattedTool];
            });
        }

        // Handle report resolution if needed
        if (activeReportId) {
            await handleUpdateReport(activeReportId, 'RESOLVED');
            setActiveReportId(null);
        }

        setEditModalOpen(false);
        setEditingTool(null);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditingTool(null);
        setActiveReportId(null);
    };

    // Delete confirmation state
    const [deletingToolId, setDeletingToolId] = useState<string | null>(null);

    if (status === "loading" || loading) {
        return <DashboardSkeleton isAdmin={isAdmin || false} />;
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center text-white gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600/10 blur-[100px] pointer-events-none" />
                <h1 className="text-3xl font-bold tracking-tight">Access Restricted</h1>
                <p className="text-gray-400 max-w-md text-center">You need to be logged in to manage your tools and view analytics.</p>
                <PremiumButton href="/submit" label="Log In / Sign Up" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030014] text-white p-6 pt-32 relative">
            {/* Background Ambience */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

            <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-500 ${editModalOpen ? 'blur-xl scale-[0.98] opacity-50' : 'blur-0 scale-100 opacity-100'}`}>
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-4 tracking-tight">
                            {isAdmin ? "Admin Center" : "Creator Studio"}
                            <span className={`text-xs px-3 py-1 rounded-full border font-mono tracking-wide ${isAdmin ? 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}>
                                {isAdmin ? 'ADMIN' : 'CREATOR'}
                            </span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">Manage your tools, track performance, and update details.</p>
                    </div>
                    {!isAdmin && (
                        <PremiumButton
                            href="/submit"
                            label="Submit New Tool"
                            variant="primary"
                            icon={
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            }
                            className="bg-gradient-to-r from-green-600 to-emerald-600 border-none"
                        />
                    )}
                </header>

                {/* Premium Stats Cards for Admin */}
                {isAdmin && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {/* Total Tools */}
                        <SpotlightCard delay={0.1} className="group bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-indigo-500/20 rounded-xl">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">+12%</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{allTools.length}</h3>
                            <p className="text-sm text-gray-400">Total Tools</p>
                        </SpotlightCard>

                        {/* Pending Approvals */}
                        <SpotlightCard delay={0.2} className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-yellow-500/30">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-yellow-500/20 rounded-xl">
                                    <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                {pendingTools.length > 0 && (
                                    <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20 animate-pulse">Needs Action</span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{pendingTools.length}</h3>
                            <p className="text-sm text-gray-400">Pending Approvals</p>
                        </SpotlightCard>

                        {/* Active Users */}
                        <SpotlightCard delay={0.3} className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-green-500/30">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-500/20 rounded-xl">
                                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">+8%</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{users.length}</h3>
                            <p className="text-sm text-gray-400">Total Users</p>
                        </SpotlightCard>

                        {/* Reports */}
                        <SpotlightCard delay={0.4} className="group bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-red-500/30">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-red-500/20 rounded-xl">
                                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                {reports.filter(r => r.status === 'PENDING').length > 0 && (
                                    <span className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
                                        {reports.filter(r => r.status === 'PENDING').length} New
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{reports.length}</h3>
                            <p className="text-sm text-gray-400">Total Reports</p>
                        </SpotlightCard>
                    </div>
                )}

                {/* Tabs for Admin */}
                {isAdmin && (
                    <div className="flex flex-wrap gap-1 mb-10 p-1 bg-black/20 rounded-xl w-fit border border-white/5">
                        <TabButton
                            active={activeTab === 'approvals'}
                            onClick={() => setActiveTab('approvals')}
                            label={`Approvals (${pendingTools.length})`}
                        />
                        <TabButton
                            active={activeTab === 'manage-tools'}
                            onClick={() => setActiveTab('manage-tools')}
                            label={`All Tools (${allTools.length})`}
                        />
                        <TabButton
                            active={activeTab === 'users'}
                            onClick={() => setActiveTab('users')}
                            label={`Users (${users.length})`}
                        />
                        <TabButton
                            active={activeTab === 'reports'}
                            onClick={() => setActiveTab('reports')}
                            label={`Reports (${reports.length})`}
                        />
                    </div>
                )}

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="min-h-[400px]"
                    >
                        {/* User View: My Tools */}
                        {!isAdmin && (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <AnimatePresence>
                                        {myTools.map((tool, i) => (
                                            <ToolCard key={tool.id} tool={tool} index={i} isOwner={true} onEdit={handleOpenEdit} />
                                        ))}
                                    </AnimatePresence>
                                    {myTools.length === 0 && <EmptyState message="You haven't submitted any tools yet. Share your first project!" />}
                                </div>

                                {/* User Reports Section */}
                                {reports.length > 0 && (
                                    <div className="mt-12">
                                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            Reports on Your Tools ({reports.length})
                                        </h2>
                                        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                                            <div className="divide-y divide-white/5">
                                                {reports.map((report, i) => (
                                                    <motion.div
                                                        key={report.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="p-6 hover:bg-white/5 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h3 className="font-bold text-white">{report.tool.name}</h3>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                                                                        report.status === 'REVIEWED' ? 'bg-blue-500/20 text-blue-300' :
                                                                            report.status === 'RESOLVED' ? 'bg-green-500/20 text-green-300' :
                                                                                'bg-gray-500/20 text-gray-300'
                                                                        }`}>
                                                                        {report.status}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-400 mb-1">
                                                                    <span className="font-medium text-white">Issue:</span> {report.reason}
                                                                </p>
                                                                <p className="text-sm text-gray-500 mb-3">{report.description}</p>
                                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                    <span>Reported by: {report.userName || 'Anonymous'}</span>
                                                                    <span>•</span>
                                                                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {report.status !== 'RESOLVED' && (
                                                                    <button
                                                                        onClick={() => handleResolveReport(report)}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all border border-green-500/20 text-xs font-bold uppercase tracking-wider"
                                                                        title="Resolve Issue"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Resolve
                                                                    </button>
                                                                )}
                                                                <Link
                                                                    href={`/item/${report.tool.id}`}
                                                                    className="p-2 hover:bg-indigo-500/10 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors"
                                                                    title="View Tool"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                    </svg>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Admin View: Pending Approvals */}
                        {isAdmin && activeTab === 'approvals' && (
                            <div className="grid gap-6">
                                {pendingTools.map((tool, i) => (
                                    <AdminToolCard
                                        key={tool.id}
                                        tool={tool}
                                        index={i}
                                        onApprove={() => handleApproveReject(tool.id, 'approve')}
                                        onReject={() => handleApproveReject(tool.id, 'reject')}
                                    />
                                ))}
                                {pendingTools.length === 0 && <EmptyState message="All caught up! No pending approvals." />}
                            </div>
                        )}

                        {/* Admin View: Manage Tools */}
                        {isAdmin && activeTab === 'manage-tools' && (
                            <div className="space-y-6">
                                {/* Search & Filter Bar */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search tools by name, category, or creator..."
                                            value={adminSearch}
                                            onChange={(e) => setAdminSearch(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                                        />
                                    </div>
                                    <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all">
                                        <option value="all">All Categories</option>
                                        <option value="ai">AI Tools</option>
                                        <option value="dev">Development</option>
                                        <option value="design">Design</option>
                                    </select>
                                </div>

                                {/* Tools Grid */}
                                <div className="grid gap-4">
                                    {allTools.filter(t =>
                                        !adminSearch ||
                                        t.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                                        t.submitter?.name?.toLowerCase().includes(adminSearch.toLowerCase()) ||
                                        t.category?.toLowerCase().includes(adminSearch.toLowerCase())
                                    ).map((tool, i) => (
                                        <SpotlightCard
                                            key={tool.id}
                                            delay={Math.min(i * 0.05, 0.4)}
                                            className="group bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-5"
                                        >
                                            <div className="relative flex items-center justify-between gap-6">
                                                {/* Tool Info */}
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    {/* Logo */}
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 p-2.5 flex items-center justify-center relative overflow-hidden flex-shrink-0 shadow-lg">
                                                        {tool.logo ? (
                                                            <Image src={tool.logo} alt="" fill className="object-contain p-1" />
                                                        ) : (
                                                            <span className="text-2xl">🛠️</span>
                                                        )}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors truncate">
                                                                {tool.name}
                                                            </h3>
                                                            <Badge status={tool.approved ? 'approved' : 'pending'} />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                                            <span className="truncate">by {tool.submitter?.name || 'Unknown'}</span>
                                                            <span className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0"></span>
                                                            <span className="text-gray-500 truncate">{tool.category}</span>
                                                            <span className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0"></span>
                                                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">
                                                                {tool.pricing}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 flex-shrink-0">
                                                    {deletingToolId === tool.id ? (
                                                        // Inline delete confirmation
                                                        <div className="flex gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                                                            <span className="text-sm text-red-300">Delete?</span>
                                                            <button
                                                                onClick={() => handleDelete(tool.id)}
                                                                className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-all"
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingToolId(null)}
                                                                className="px-2 py-0.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded transition-all"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleOpenEdit(tool)}
                                                                className="p-2.5 hover:bg-indigo-500/10 rounded-lg text-gray-400 hover:text-indigo-400 transition-all hover:scale-110 active:scale-95"
                                                                title="Edit Tool"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <Link
                                                                href={`/item/${tool.id}`}
                                                                className="p-2.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all hover:scale-110"
                                                                title="View Tool Page"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </Link>
                                                            <button
                                                                onClick={() => setDeletingToolId(tool.id)}
                                                                className="p-2.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all hover:scale-110 active:scale-95"
                                                                title="Delete Tool"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </SpotlightCard>
                                    ))}
                                </div>

                                {allTools.length === 0 && <EmptyState message="No tools found" />}
                            </div>
                        )}

                        {/* Admin View: Users */}
                        {isAdmin && activeTab === 'users' && (
                            <div className="grid gap-4">
                                {users.map((user, i) => (
                                    <SpotlightCard
                                        key={user.id}
                                        delay={Math.min(i * 0.05, 0.4)}
                                        className="group bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-5"
                                    >
                                        <div className="relative flex items-center justify-between gap-6">
                                            {/* User Info */}
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Avatar */}
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-900/30 flex-shrink-0">
                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-bold text-lg text-white truncate">
                                                            {user.name || 'Anonymous'}
                                                        </h3>
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${user.role === 'ADMIN'
                                                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                                            : 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <span className="truncate">{user.email}</span>
                                                        <span className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0"></span>
                                                        <span className="text-gray-500">{user.toolCount} tools</span>
                                                        <span className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0"></span>
                                                        <span className="text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats & Actions */}
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-center px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="text-2xl font-bold text-white">{user.toolCount}</div>
                                                    <div className="text-xs text-gray-400">Tools</div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setAdminSearch(user.name || "");
                                                        setActiveTab('manage-tools');
                                                    }}
                                                    className="p-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl transition-all border border-indigo-500/20 active:scale-95"
                                                    title="View User Tools"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                ))}
                                {users.length === 0 && <EmptyState message="No users found" />}
                            </div>
                        )}

                        {/* Admin View: Reports */}
                        {isAdmin && activeTab === 'reports' && (
                            <div className="grid gap-4">
                                {reports.map((report, i) => (
                                    <motion.div
                                        key={report.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group relative bg-[#111] border border-white/10 rounded-[1.5rem] p-6 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_10px_40px_rgba(79,70,229,0.1)] overflow-hidden"
                                    >
                                        <div className="relative flex flex-col md:flex-row gap-6">
                                            {/* Status Side Pillar */}
                                            <div className={`absolute left-[-1.5rem] top-0 bottom-0 w-1.5 ${report.status === 'PENDING' ? 'bg-yellow-500' :
                                                report.status === 'REVIEWED' ? 'bg-blue-500' :
                                                    report.status === 'RESOLVED' ? 'bg-green-500' : 'bg-zinc-700'
                                                }`} />

                                            {/* Tool Info */}
                                            <div className="flex-1 flex gap-5">
                                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 p-2 flex items-center justify-center flex-shrink-0 relative">
                                                    {report.tool.logo ? <Image src={report.tool.logo} alt="" fill className="object-contain p-2" /> : <span className="text-2xl">🛠️</span>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight truncate">{report.tool.name}</h3>
                                                        <span className="text-[10px] text-zinc-500 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded uppercase font-black">{report.tool.category}</span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs mb-3 truncate">{report.tool.url}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${report.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                            report.status === 'REVIEWED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                                report.status === 'RESOLVED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                                    'bg-zinc-800 text-zinc-500 border border-zinc-700'
                                                            }`}>
                                                            {report.status}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                                            Reported {new Date(report.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Report Details */}
                                            <div className="flex-1 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400/70 mb-2">Issue Reported</div>
                                                <div className="text-sm font-bold text-white mb-1">{report.reason}</div>
                                                <div className="text-xs text-gray-400 leading-relaxed italic line-clamp-2">
                                                    "{report.description}"
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex md:flex-col gap-2 justify-center">
                                                <Link
                                                    href={`/item/${report.tool.id}`}
                                                    className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/5"
                                                    title="View Tool"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                {report.status !== 'RESOLVED' && (
                                                    <button
                                                        onClick={() => handleResolveReport(report)}
                                                        className="p-3 bg-green-500/5 hover:bg-green-500/20 text-green-500 hover:text-green-400 rounded-xl transition-all border border-green-500/10"
                                                        title="Resolve Issue"
                                                    >
                                                        <div className="flex flex-col items-center gap-1">
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span className="text-[10px] font-black uppercase tracking-tighter">Resolve</span>
                                                        </div>
                                                    </button>
                                                )}
                                                {report.status !== 'DISMISSED' && (
                                                    <button
                                                        onClick={() => handleUpdateReport(report.id, 'DISMISSED')}
                                                        className="p-3 bg-red-500/5 hover:bg-red-500/20 text-red-500/70 hover:text-red-400 rounded-xl transition-all border border-red-500/10"
                                                        title="Dismiss"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {reports.length === 0 && (
                                    <div className="p-20 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
                                        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
                                            <svg className="w-10 h-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Clean Slate</h3>
                                        <p className="text-gray-500">No active reports to handle at the moment.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

            </div>

            {/* Edit Tool Modal */}
            <EditToolModal
                isOpen={editModalOpen}
                onClose={handleCloseEditModal}
                tool={editingTool}
                onSave={handleSaveTool}
                isResolving={!!activeReportId}
            />
        </div>
    );
}

// Components

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative z-10 ${active ? "text-white" : "text-gray-400 hover:text-white"}`}
        >
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            {label}
        </button>
    )
}

function ToolCard({ tool, isOwner, index, onEdit }: { tool: any, isOwner?: boolean, index: number, onEdit?: (tool: any) => void }) {
    return (
        <SpotlightCard
            delay={index * 0.1}
            className="group bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-3xl p-6 flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:-translate-y-2 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[80px] group-hover:bg-indigo-600/20 transition-all duration-500" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 p-3 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        {tool.logo ? <Image src={tool.logo} alt={tool.name} fill className="object-contain p-2" /> : <span className="text-3xl">⚡</span>}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
                    </div>
                    <Badge status={tool.approved ? 'approved' : 'pending'} />
                </div>

                <h3 className="font-bold text-2xl mb-3 text-white group-hover:text-indigo-300 transition-colors duration-300 leading-tight">
                    {tool.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {tool.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        {tool.pricing}
                    </span>
                </div>

                <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed h-10">
                    {tool.description}
                </p>

                {!tool.approved && tool.rejectionReason && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-300"
                    >
                        <div className="flex items-center gap-2 mb-1 font-bold text-red-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Revision Required
                        </div>
                        {tool.rejectionReason}
                    </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <PremiumButton
                        href={`/item/${tool.id}`}
                        label="View Tool"
                        variant="glass"
                        fullWidth
                        className="!text-xs !py-3 rounded-xl border-white/10 active:scale-95"
                    />
                    <button
                        onClick={() => onEdit?.(tool)}
                        className="px-4 py-3 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/50 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
                    >
                        <svg className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Details
                    </button>
                </div>
            </div>
        </SpotlightCard>
    );
}

function AdminToolCard({ tool, onApprove, onReject, index }: { tool: any, onApprove: () => void, onReject: () => void, index: number }) {
    return (
        <SpotlightCard
            delay={index * 0.1}
            className="group bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] hover:border-indigo-500/30 overflow-visible"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] pointer-events-none" />

            <div className="p-8 flex flex-col lg:flex-row gap-10">
                <div className="w-full lg:w-72 h-48 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center flex-shrink-0 relative overflow-hidden group/img">
                    {tool.logo ? <Image src={tool.logo} alt={tool.name} fill className="object-contain p-6 group-hover/img:scale-110 transition-transform duration-700" /> : <span className="text-4xl">📦</span>}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-3xl font-extrabold text-white tracking-tight">{tool.name}</h3>
                                <div className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                    NEW
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-indigo-400/80 uppercase tracking-widest">{tool.category}</span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-xs font-mono text-zinc-500">{tool.pricing}</span>
                            </div>
                        </div>
                        <div className="flex -space-x-2">
                            <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white relative z-10 shadow-xl">
                                {tool.submitter?.name?.[0]}
                            </div>
                        </div>
                    </div>

                    <div className="relative mb-8 flex-1">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full" />
                        <p className="text-gray-400 leading-relaxed text-sm lg:text-base italic pl-2 line-clamp-3">
                            "{tool.description}"
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mt-auto">
                        <a
                            href={tool.url}
                            target="_blank"
                            className="flex items-center gap-2.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all border border-white/10"
                        >
                            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            View Source Website
                        </a>

                        <div className="flex items-center gap-3 ml-auto">
                            <button
                                onClick={onReject}
                                className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-red-500/20"
                            >
                                Reject
                            </button>
                            <button
                                onClick={onApprove}
                                className="px-10 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.5)] active:scale-95"
                            >
                                Approve Tool
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
}

function Badge({ status }: { status: 'approved' | 'pending' }) {
    if (status === 'approved') {
        return <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold tracking-wide uppercase">Approved</span>
    }
    return <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
        Pending
    </span>
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
            <motion.span
                initial={{ y: 0 }}
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl mb-4 opacity-50 block"
            >
                ⚡
            </motion.span>
            <p className="text-gray-400 text-lg font-medium">{message}</p>
        </div>
    );
}
