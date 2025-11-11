"use client";

import React from "react";
import Aurora from "./Aurora";

function Background() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#030014] overflow-hidden">
            {/* Aurora WebGL Effect */}
            <div className="absolute inset-0 w-full h-full opacity-40">
                <Aurora
                    colorStops={['#4F46E5', '#9333EA', '#EC4899']} // Indigo -> Purple -> Pink
                    amplitude={1.2}
                    blend={0.6}
                    speed={0.5}
                />
            </div>

            {/* Noise Texture Overlay for subtle grain */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}

export default React.memo(Background);
