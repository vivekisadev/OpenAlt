"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    className?: string; // Additional classes for the trigger wrapper
}

export default function Tooltip({ children, content, position = "top", className = "" }: TooltipProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);
    const exitTime = useRef(0);

    // Determines initial position styles (CSS)
    const getPositionClasses = () => {
        switch (position) {
            case "top": return "bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2";
            case "bottom": return "top-[calc(100%+12px)] left-1/2 -translate-x-1/2";
            case "left": return "right-[calc(100%+12px)] top-1/2 -translate-y-1/2";
            case "right": return "left-[calc(100%+12px)] top-1/2 -translate-y-1/2";
            default: return "bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2";
        }
    };

    // Arrow styles
    const getArrowClasses = () => {
        switch (position) {
            case "top": return "top-full left-1/2 -translate-x-1/2 border-t-white border-x-transparent border-b-transparent";
            case "bottom": return "bottom-full left-1/2 -translate-x-1/2 border-b-white border-x-transparent border-t-transparent";
            case "left": return "left-full top-1/2 -translate-y-1/2 border-l-white border-y-transparent border-r-transparent";
            case "right": return "right-full top-1/2 -translate-y-1/2 border-r-white border-y-transparent border-l-transparent";
            default: return "top-full left-1/2 -translate-x-1/2 border-t-white border-x-transparent border-b-transparent";
        }
    };

    useGSAP(() => {
        if (!tooltipRef.current) return;

        const el = tooltipRef.current;
        const t = gsap.timeline({ paused: true });

        // Logic based on User Request
        // Enter: Opacity 0->1, Scale 0.2->1

        // Determine enter motion direction based on position
        let initialXPercent = 0;
        let initialYPercent = 0;

        if (position === "top") initialYPercent = 50;
        else if (position === "bottom") initialYPercent = -50;
        else if (position === "left") initialXPercent = 50;
        else if (position === "right") initialXPercent = -50;

        t.fromTo(el,
            {
                opacity: 0,
                scale: 0.2,
                xPercent: initialXPercent,
                yPercent: initialYPercent,
                display: "none"
            },
            {
                opacity: 1,
                scale: 1,
                xPercent: 0,
                yPercent: 0,
                display: "block",
                duration: 0.5,
                ease: "expo.out"
            }
        );

        t.addPause();
        exitTime.current = t.duration();

        // Exit: Fallout drops DOWN (yPercent positive) + Rotate
        t.to(el, {
            yPercent: 400, // Matching user request for dramatic drop
            rotation: "random([-90, 90, -45, 45])", // Random rotation
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => {
                gsap.set(el, { display: "none" });
            }
        });

        tl.current = t;

    }, { scope: containerRef, dependencies: [position] });

    const handleMouseEnter = () => {
        if (!tl.current) return;
        if (tl.current.time() < exitTime.current) {
            tl.current.play();
        } else {
            tl.current.restart();
        }
    };

    const handleMouseLeave = () => {
        if (!tl.current) return;
        if (tl.current.time() < exitTime.current) {
            tl.current.reverse();
        } else {
            // "invalidate().play()" to get new random rotation
            tl.current.invalidate().play();
        }
    };

    if (!content) return <>{children}</>;

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center justify-center group/tooltip ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <div
                ref={tooltipRef}
                className={`absolute z-50 px-3 py-2 text-xs font-bold text-black bg-white rounded-xl shadow-xl pointer-events-none opacity-0 whitespace-nowrap border border-gray-100 ${getPositionClasses()}`}
            >
                {content}
                {/* Arrow */}
                <div className={`absolute w-0 h-0 border-[6px] ${getArrowClasses()}`} />
            </div>
        </div>
    );
}
