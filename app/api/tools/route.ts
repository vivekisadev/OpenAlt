import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            category,
            description,
            longDescription,
            url,
            githubUrl,
            tags,
            logo,
            image,
            features,
            pricing
        } = body;

        const tool = await prisma.tool.create({
            data: {
                name,
                category,
                description,
                longDescription,
                url,
                githubUrl,
                tags: Array.isArray(tags) ? tags.join(",") : tags,
                logo: logo || "https://via.placeholder.com/150",
                image,
                features: Array.isArray(features) ? features.join(",") : features,
                pricing,
                approved: false,
                userId: session.user.id,
            },
        });

        return NextResponse.json(tool, { status: 201 });
    } catch (error) {
        console.error("Error creating tool:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const tools = await prisma.tool.findMany({
            where: { approved: true },
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
                longDescription: true,
                // Exclude image for performance
            }
        });

        // Transform tags and features back to array
        const formattedTools = tools.map((t: any) => ({
            ...t,
            tags: t.tags ? t.tags.split(",") : [],
            features: t.features ? t.features.split(",") : [],
        }));

        return NextResponse.json(formattedTools);
    } catch (error) {
        console.error("Error creating tool:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
