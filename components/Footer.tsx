"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative z-10 w-full border-t border-white/5 bg-black/20 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        Created by{" "}
                        <Link
                            href="https://github.com/vivekisadev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-1 text-white font-medium"
                        >
                            <span className="relative">
                                Vivek Verma
                                {/* Underline effect */}
                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-200 ease-out"></span>
                            </span>
                            {/* Arrow that appears on hover - Pure CSS */}
                            <svg
                                className="w-4 h-4 opacity-0 -translate-x-1 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 17L17 7M17 7H7M17 7V17"
                                />
                            </svg>
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
