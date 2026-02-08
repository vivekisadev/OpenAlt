export default function DashboardSkeleton({ isAdmin }: { isAdmin: boolean }) {
    return (
        <div className="min-h-screen bg-[#030014] text-white p-6 pt-32 relative">
            {/* Background Ambience */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Skeleton */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div className="flex-1">
                        <div className="h-10 bg-white/5 rounded-lg w-64 mb-2 animate-pulse" />
                        <div className="h-5 bg-white/5 rounded-lg w-96 animate-pulse" />
                    </div>
                    {!isAdmin && (
                        <div className="h-12 bg-white/5 rounded-lg w-48 animate-pulse" />
                    )}
                </header>

                {/* Tabs Skeleton */}
                {isAdmin && (
                    <div className="flex flex-wrap gap-2 mb-10 p-1 bg-white/5 rounded-2xl w-fit backdrop-blur-sm border border-white/10">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-10 bg-white/5 rounded-xl w-32 animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Content Skeleton */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 animate-pulse">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-white/5 rounded-lg" />
                                <div className="flex-1">
                                    <div className="h-5 bg-white/5 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-white/5 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="h-4 bg-white/5 rounded w-full mb-2" />
                            <div className="h-4 bg-white/5 rounded w-5/6" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
