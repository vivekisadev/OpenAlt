"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaidAlternativePreviewProps {
    toolName: string;
    position?: { x: number; y: number };
}

// Common cons for popular paid tools
const paidToolInfo: Record<string, { description: string; cons: string[] }> = {
    "Notion": {
        description: "All-in-one workspace for notes, docs, and collaboration",
        cons: ["Expensive for teams", "Can be slow with large databases", "Steep learning curve", "Limited offline functionality"]
    },
    "Slack": {
        description: "Team communication and collaboration platform",
        cons: ["Expensive per user pricing", "Message history limits on free plan", "Can be distracting", "Storage limitations"]
    },
    "Figma": {
        description: "Collaborative interface design tool",
        cons: ["Subscription-based pricing", "Requires internet connection", "Limited free plan", "Can be resource-intensive"]
    },
    "Adobe": {
        description: "Creative Cloud suite of design tools",
        cons: ["Very expensive subscription", "Bloated software", "Requires constant updates", "Vendor lock-in"]
    },
    "Photoshop": {
        description: "Professional image editing software",
        cons: ["Expensive monthly subscription", "Steep learning curve", "Resource-intensive", "Overkill for simple tasks"]
    },
    "Microsoft Teams": {
        description: "Business communication platform",
        cons: ["Requires Microsoft 365", "Complex interface", "Resource-heavy", "Privacy concerns"]
    },
    "Zoom": {
        description: "Video conferencing platform",
        cons: ["Time limits on free plan", "Privacy concerns", "Expensive for large teams", "Requires account creation"]
    },
    "Jira": {
        description: "Project management and issue tracking",
        cons: ["Expensive licensing", "Overly complex", "Slow performance", "Steep learning curve"]
    },
    "Asana": {
        description: "Work management platform",
        cons: ["Limited free plan", "Expensive for teams", "Can be overwhelming", "Mobile app limitations"]
    },
    "Trello": {
        description: "Visual project management tool",
        cons: ["Limited automation on free plan", "Not suitable for complex projects", "Paid power-ups", "Limited reporting"]
    },
    "Chrome": {
        description: "Google's web browser",
        cons: ["Privacy concerns", "High memory usage", "Google tracking", "Battery drain"]
    },
    "Dropbox": {
        description: "Cloud storage and file synchronization",
        cons: ["Limited free storage", "Expensive compared to competitors", "Privacy concerns", "Sync issues"]
    },
    "1Password": {
        description: "Password manager",
        cons: ["Subscription required", "No free tier", "Expensive for families", "Proprietary format"]
    },
    "GitHub Copilot": {
        description: "AI pair programmer",
        cons: ["Monthly subscription fee", "Privacy concerns with code", "Not always accurate", "Requires internet"]
    },
    "Mailchimp": {
        description: "Email marketing platform",
        cons: ["Expensive for large lists", "Limited automation on free plan", "Complex pricing", "Email deliverability issues"]
    },
};

export default function PaidAlternativePreview({ toolName, position }: PaidAlternativePreviewProps) {
    const info = paidToolInfo[toolName] || {
        description: "Proprietary commercial software",
        cons: ["Paid subscription required", "Closed source", "Vendor lock-in", "Limited customization"]
    };

    // Determine if we should show above or below based on viewport position
    const cardHeight = 280; // Approximate height of the preview card
    const showBelow = (position?.y || 0) < cardHeight + 100; // Show below if near top of viewport

    const topPosition = showBelow
        ? `${(position?.y || 0) + 30}px` // Below the element
        : `${(position?.y || 0) - cardHeight}px`; // Above the element

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: showBelow ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: showBelow ? -10 : 10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] w-72"
            style={{
                left: `${position?.x}px`,
                top: topPosition,
            }}
        >
            <div className="bg-[#0D0D0D] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-white/5 px-4 py-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {toolName}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">{info.description}</p>
                </div>

                {/* Cons List */}
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Common Issues</span>
                    </div>
                    <ul className="space-y-2">
                        {info.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className="bg-white/[0.02] border-t border-white/5 px-4 py-2">
                    <p className="text-[10px] text-gray-500 italic">
                        Consider the open-source alternative above
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
