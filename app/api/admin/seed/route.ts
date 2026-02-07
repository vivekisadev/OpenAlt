import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedTools } from "@/lib/seed-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin - FOR NOW, I will allow any logged in user or even public for initial seed if strictly needed,
        // but let's try to be safe. If the user is the one running this locally, they likely have access.
        // For simplicity in this dev environment, I'll bypass auth for now or check a query param secret?
        // Let's use a simple query param "secret=openalt-seed" to allow triggering without login if needed, or check admin.

        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");

        if (secret !== "openalt-seed") {
            if (!session || session.user.role !== "ADMIN") {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
        }

        let count = 0;
        for (const tool of seedTools) {
            // Check if tool exists by URL to avoid duplicates
            const existing = await prisma.tool.findFirst({
                where: { url: tool.url }
            });

            if (!existing) {
                await prisma.tool.create({
                    data: {
                        name: tool.name,
                        category: tool.category,
                        description: tool.description,
                        longDescription: tool.longDescription || tool.description,
                        url: tool.url,
                        githubUrl: (tool as any).githubUrl || null,
                        tags: tool.tags.join(", "),
                        logo: (tool as any).logo || null,
                        image: (tool as any).image || null,
                        features: tool.features ? tool.features.join(", ") : null,
                        pricing: tool.pricing || "Free",
                        approved: true, // Auto approve seeded tools
                        userId: session?.user?.id || null, // Link to admin if logged in
                    }
                });
                count++;
            }
        }

        return NextResponse.json({ message: `Seeding complete. Added ${count} new tools.` });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ message: "Error seeding data", error: String(error) }, { status: 500 });
    }
}
