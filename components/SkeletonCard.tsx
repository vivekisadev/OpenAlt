import { motion } from "framer-motion";

export default function SkeletonCard() {
    return (
        <div className="h-full bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 flex flex-col">
            <div className="relative z-10 flex flex-col h-full animate-pulse">
                {/* Header: Logo & Badge */}
                <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/5"></div>
                    <div className="w-12 h-6 rounded-md bg-white/10"></div>
                </div>

                {/* Content */}
                <div className="mb-4 space-y-2">
                    <div className="h-6 w-1/2 bg-white/10 rounded"></div>
                    <div className="h-4 w-1/3 bg-white/5 rounded"></div>
                </div>

                <div className="space-y-2 mb-6 flex-grow">
                    <div className="h-4 w-full bg-white/5 rounded"></div>
                    <div className="h-4 w-full bg-white/5 rounded"></div>
                    <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                </div>

                {/* Footer: Tags */}
                <div className="flex gap-2 pt-4 border-t border-white/5">
                    <div className="h-4 w-12 bg-white/5 rounded"></div>
                    <div className="h-4 w-16 bg-white/5 rounded"></div>
                    <div className="h-4 w-10 bg-white/5 rounded"></div>
                </div>
            </div>
        </div>
    );
}
