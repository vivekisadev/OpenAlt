import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: any
) {
    try {
        // Next.js 14/15/16 Params handling
        let id: string | undefined;
        try {
            const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params));
            id = resolvedParams?.id;
        } catch (pe) {
            console.error("Error resolving params:", pe);
        }

        if (!id) {
            // Fallback: try to get ID from URL if params resolution failed
            const url = new URL(req.url);
            const pathParts = url.pathname.split('/');
            id = pathParts[pathParts.length - 1];
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized: No session found" }, { status: 401 });
        }

        const body = await req.json();

        const { name, description, longDescription, url, githubUrl, category, pricing, logo, image, tags, features } = body;

        // Fetch the existing tool to verify access
        const existingTool = await prisma.tool.findUnique({
            where: { id },
        });

        if (!existingTool) {
            console.error("Tool not found in DB with ID:", id);
            return NextResponse.json({ message: `Tool not found (ID: ${id})` }, { status: 404 });
        }

        const userObj = session.user as any;
        const isAdmin = userObj?.role === "ADMIN";
        const isOwner = existingTool.userId === userObj?.id;

        // Check permissions
        if (!isAdmin && !isOwner) {
            return NextResponse.json(
                { message: "You don't have permission to edit this tool" },
                { status: 403 }
            );
        }

        // Prepare update data
        const updateData: any = {
            name: name || undefined,
            description: description || undefined,
            longDescription: longDescription || undefined,
            url: url || undefined,
            githubUrl: githubUrl || undefined,
            category: category || undefined,
            pricing: pricing || undefined,
            logo: logo || undefined,
            image: image || undefined,
        };

        // Handle tags and features (comma-separated strings in DB)
        if (tags !== undefined) {
            updateData.tags = Array.isArray(tags) ? tags.join(",") : (tags || "");
        }
        if (features !== undefined) {
            updateData.features = Array.isArray(features) ? features.join(",") : (features || "");
        }

        // Non-admin users need re-approval when editing
        if (!isAdmin && isOwner) {
            updateData.approved = false;
        }

        const updatedTool = await prisma.tool.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedTool);
    } catch (error: any) {
        console.error("CRITICAL ERROR during tool update:", error);
        return NextResponse.json(
            {
                message: `Update failed: ${error.message || 'Internal error'}`,
                error: error.message,
                code: error.code, // Prisma error codes (e.g., P2002)
                stack: error.stack
            },
            { status: 500 }
        );
    }
}
