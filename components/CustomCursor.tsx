"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const lastCheckTime = useRef(0);

    // Use MotionValues for high-performance updates
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring for the outer ring (trailer) - less stiff
    const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            // Update MotionValues directly
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Direct DOM update for the inner dot (zero latency)
            if (cursorRef.current) {
                const scale = isHovering ? 2.5 : 1;
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${scale})`;
            }

            // Throttle hover checking to every 100ms
            const now = Date.now();
            if (now - lastCheckTime.current > 100) {
                lastCheckTime.current = now;
                const target = e.target as HTMLElement;
                const isInteractive =
                    target.tagName === "BUTTON" ||
                    target.tagName === "A" ||
                    target.tagName === "INPUT" ||
                    target.closest("button") ||
                    target.closest("a") ||
                    target.closest("input") ||
                    target.closest(".cursor-pointer");

                setIsHovering(!!isInteractive);
            }
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, [isHovering, mouseX, mouseY]);

    return (
        <>
            {/* Inner Dot - Zero Latency via direct ref */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference will-change-transform"
                style={{ transform: "translate3d(-100px, -100px, 0)" }}
            />

            {/* Outer Ring - Smooth Spring Follow */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[100] mix-blend-difference will-change-transform"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            />
        </>
    );
}
