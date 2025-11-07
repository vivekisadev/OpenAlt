import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const tools = await prisma.tool.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                category: true,
                description: true,
                url: true,
                githubUrl: true,
                tags: true,
                logo: true,
                features: true,
                pricing: true,
                rating: true,
                approved: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                rejectionReason: true,
            }
        });

        // Format tags/features
        const formattedTools = tools.map((t: any) => ({
            ...t,
            tags: t.tags ? t.tags.split(",") : [],
            features: t.features ? t.features.split(",") : [],
        }));

        return NextResponse.json(formattedTools);
    } catch (error) {
        console.error("Error fetching user tools:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
