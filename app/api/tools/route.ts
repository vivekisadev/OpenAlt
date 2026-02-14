import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { submitToolSchema } from "@/lib/validations";
import { globalRateLimiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        if (!globalRateLimiter.check(ip)) {
            return NextResponse.json(
                { message: "Too many requests, please try again later." },
                { status: 429 }
            );
        }

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Validate Input
        const validation = submitToolSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

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
            pricing,
            paidAlternative
        } = validation.data;

        // Check for duplicate URL
        const existingTool = await prisma.tool.findFirst({
            where: {
                url: {
                    equals: url,
                    mode: "insensitive", // Case-insensitive check
                }
            }
        });

        if (existingTool) {
            return NextResponse.json(
                { message: "A tool with this URL already exists." },
                { status: 409 }
            );
        }

        const tool = await prisma.tool.create({
            data: {
                name,
                category,
                description,
                longDescription: longDescription || description,
                url,
                githubUrl,
                tags: Array.isArray(tags) ? tags.join(",") : (tags || ""),
                logo: logo || "https://via.placeholder.com/150",
                image: image || "",
                features: Array.isArray(features) ? features.join(",") : (features || ""),
                pricing,
                paidAlternative,
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
                paidAlternative: true,
                rating: true,
                approved: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                rejectionReason: true,
                longDescription: true,
                image: true
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
        console.error("Error fetching tools:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
