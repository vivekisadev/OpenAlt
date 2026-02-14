import { motion } from "framer-motion";

export default function SkeletonCard() {
    return (
        <div className="h-full min-h-[320px] bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden flex flex-col animate-pulse">
            <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 min-w-0 w-full">
                        {/* Logo */}
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 shrink-0" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-5 w-3/4 bg-white/10 rounded" />
                            <div className="h-3 w-1/3 bg-white/5 rounded" />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4 flex-grow space-y-2">
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-2/3 bg-white/5 rounded" />
                </div>

                {/* Footer */}
                <div className="h-10 mt-auto flex items-center gap-2">
                    <div className="h-5 w-16 bg-white/5 rounded-full" />
                    <div className="h-5 w-12 bg-white/5 rounded-full" />
                </div>
            </div>
        </div>
    );
}
