"use client";

export default function ItemPageSkeleton() {
    return (
        <div className="min-h-screen bg-[#050608] text-white pt-32 pb-20 animate-pulse">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                    {/* LEFT COLUMN - MAIN CONTENT */}
                    <div className="flex flex-col">
                        {/* Breadcrumbs Skeleton */}
                        <div className="flex gap-2 mb-6">
                            <div className="h-4 w-16 bg-white/5 rounded-full" />
                            <div className="h-4 w-4 bg-white/5 rounded-full" />
                            <div className="h-4 w-24 bg-white/5 rounded-full" />
                            <div className="h-4 w-4 bg-white/5 rounded-full" />
                            <div className="h-4 w-32 bg-white/5 rounded-full" />
                        </div>

                        {/* Header Skeleton */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/5 p-3 flex-shrink-0" />
                                <div>
                                    <div className="h-12 w-64 bg-white/5 rounded-xl mb-3" />
                                    <div className="h-6 w-24 bg-white/5 rounded-full" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-24 bg-white/5 rounded-lg" />
                                <div className="h-10 w-10 bg-white/5 rounded-lg" />
                                <div className="h-10 w-10 bg-white/5 rounded-lg" />
                            </div>
                        </div>

                        {/* Description Skeleton */}
                        <div className="space-y-3 mb-6 max-w-3xl">
                            <div className="h-6 w-full bg-white/5 rounded-full" />
                            <div className="h-6 w-[90%] bg-white/5 rounded-full" />
                            <div className="h-6 w-[95%] bg-white/5 rounded-full" />
                        </div>

                        {/* Tags Skeleton */}
                        <div className="flex gap-2 mb-10">
                            <div className="h-8 w-20 bg-white/5 rounded-full" />
                            <div className="h-8 w-16 bg-white/5 rounded-full" />
                            <div className="h-8 w-24 bg-white/5 rounded-full" />
                            <div className="h-8 w-16 bg-white/5 rounded-full" />
                        </div>

                        {/* Main Image Skeleton */}
                        <div className="aspect-video w-full rounded-2xl bg-white/5 border border-white/5 mb-12" />

                        {/* Content Grid Skeleton -- About and Alternatives */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* About Skeleton */}
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-8 h-64" />

                            {/* Features Skeleton */}
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-64">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                                    <div className="h-6 w-32 bg-white/5 rounded-full" />
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-white/5" />
                                            <div className="h-4 w-full bg-white/5 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR SKELETON */}
                    <div className="space-y-8">
                        {/* Visit Button Skeleton */}
                        <div className="h-14 w-full bg-white/5 rounded-xl" />

                        {/* Stats Skeleton */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-20 bg-white/5 rounded-full" />
                                <div className="h-4 w-12 bg-white/5 rounded-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-16 bg-white/5 rounded-xl" />
                                <div className="h-16 bg-white/5 rounded-xl" />
                            </div>
                        </div>

                        {/* Featured Carousel Skeleton */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 h-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}
