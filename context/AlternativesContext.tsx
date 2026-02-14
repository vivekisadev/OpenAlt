"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Alternative {
    id: string;
    category: string;
    name: string;
    description: string;
    longDescription?: string;
    url: string;
    githubUrl?: string;
    logo: string;
    image?: string; // Main desktop screenshot
    tags?: string[];
    features?: string[];
    paidAlternative?: string;
    pricing?: string;
    rating?: number;
    createdAt?: string;
}

interface AlternativesContextType {
    alternatives: Alternative[];
    loading: boolean;
    addAlternative: (alt: Alternative) => void;
}

const AlternativesContext = createContext<AlternativesContextType | undefined>(undefined);

export function AlternativesProvider({ children }: { children: ReactNode }) {
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch from API
        const fetchTools = async () => {
            try {
                const res = await fetch("/api/tools");
                if (res.ok) {
                    const dbTools = await res.json();
                    console.log("Fetched tools:", dbTools.length, dbTools);
                    setAlternatives(dbTools);
                } else {
                    console.error("Failed to fetch tools", res.status);
                    setAlternatives([]);
                }
            } catch (error) {
                console.error("Failed to fetch tools", error);
                setAlternatives([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, []);

    const addAlternative = async (alt: Alternative) => {
        try {
            // Optimistic update
            setAlternatives((prev) => [alt, ...prev]);

            // Save to DB
            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alt),
            });

            if (res.ok) {
                const savedTool = await res.json();
                // Format saved tool to match interface
                const formattedTool = {
                    ...savedTool,
                    tags: savedTool.tags ? savedTool.tags.split(",") : [],
                    features: savedTool.features ? savedTool.features.split(",") : [],
                };
                // Replace optimistic item with real item (correct ID)
                setAlternatives((prev) => prev.map(p => p.id === alt.id ? formattedTool : p));
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to save tool");
            }
        } catch (error) {
            console.error("Failed to save tool", error);
            // Rollback optimistic update
            setAlternatives((prev) => prev.filter(p => p.id !== alt.id));
            throw error; // Re-throw to be caught by the UI
        }
    };

    return (
        <AlternativesContext.Provider value={{ alternatives, loading, addAlternative }}>
            {children}
        </AlternativesContext.Provider>
    );
}

export function useAlternatives() {
    const context = useContext(AlternativesContext);
    if (context === undefined) {
        throw new Error("useAlternatives must be used within a AlternativesProvider");
    }
    return context;
}
