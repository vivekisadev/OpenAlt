"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function CustomCursor() {
    const [cursorState, setCursorState] = useState<"default" | "button" | "text" | "label">("default");
    const [cursorText, setCursorText] = useState("");
    const [isClicking, setIsClicking] = useState(false);

    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Physics strictly matching the user's "Skiper67" component example
    // Default Framer Motion spring is stiffness: 100, damping: 10.
    // User specified mass: 0.1.
    const springConfig = { stiffness: 100, damping: 10, mass: 0.1 };

    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target as HTMLElement;
            if (!target) return;

            // Check for data-cursor-text first (highest priority)
            const cursorLabel = target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text");

            // Check computed style for cursor type
            const computedStyle = window.getComputedStyle(target);

            if (cursorLabel) {
                setCursorText(cursorLabel);
                setCursorState("label");
            } else {
                setCursorState("default");
                setCursorText("");
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener("mousemove", moveCursor, { passive: true });
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [mouseX, mouseY]);

    // Don't render on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
            <AnimatePresence>
                {cursorState === "label" && (
                    <motion.div
                        layout
                        id="custom-cursor"
                        className="fixed top-0 left-0 flex items-center justify-center text-white mix-blend-difference backdrop-invert"
                        style={{
                            x: cursorX,
                            y: cursorY,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: isClicking ? 0.9 : 1,
                            width: "auto",
                            height: "auto",
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 10,
                            mass: 0.1,
                            layout: {
                                type: "spring",
                                stiffness: 100,
                                damping: 10,
                                mass: 0.1
                            }
                        }}
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap text-xs font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            {cursorText} <ArrowUpRight className="w-3.5 h-3.5" />
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
