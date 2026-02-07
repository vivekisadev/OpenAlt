import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const reportSchema = z.object({
    toolId: z.string(),
    reason: z.string().min(5, "Reason must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    userName: z.string().optional(),
    userEmail: z.string().email().optional().or(z.literal("")),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();

        const validation = reportSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { toolId, reason, description, userName, userEmail } = validation.data;

        // Verify tool exists
        const tool = await prisma.tool.findUnique({
            where: { id: toolId },
            select: { id: true, name: true }
        });

        if (!tool) {
            return NextResponse.json(
                { message: "Tool not found" },
                { status: 404 }
            );
        }

        // Create report
        const report = await (prisma as any).report.create({
            data: {
                toolId,
                userId: session?.user?.id || null,
                userName: userName || session?.user?.name || "Anonymous",
                userEmail: userEmail || session?.user?.email || null,
                reason,
                description,
                status: "PENDING",
            },
        });

        return NextResponse.json(
            { message: "Report submitted successfully", report },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating report:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET endpoint for admin and tool creators to fetch reports
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const toolId = searchParams.get("toolId");
        const isAdmin = session.user.role === "ADMIN";

        const where: any = {};
        if (status) where.status = status;
        if (toolId) where.toolId = toolId;

        // If not admin, only show reports for tools they created
        if (!isAdmin) {
            where.tool = {
                userId: session.user.id
            };
        }

        const reports = await (prisma as any).report.findMany({
            where,
            include: {
                tool: {
                    select: {
                        id: true,
                        name: true,
                        url: true,
                        logo: true,
                        userId: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH endpoint for admin and tool creators to update report status
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { reportId, status, adminNotes } = body;
        const isAdmin = session.user.role === "ADMIN";

        if (!reportId || !status) {
            return NextResponse.json(
                { message: "Report ID and status are required" },
                { status: 400 }
            );
        }

        // If not admin, verify they own the tool being reported
        if (!isAdmin) {
            const existingReport = await (prisma as any).report.findUnique({
                where: { id: reportId },
                include: {
                    tool: {
                        select: { userId: true }
                    }
                }
            });

            if (!existingReport || existingReport.tool.userId !== session.user.id) {
                return NextResponse.json(
                    { message: "Unauthorized - you can only update reports for your own tools" },
                    { status: 403 }
                );
            }
        }

        const report = await (prisma as any).report.update({
            where: { id: reportId },
            data: {
                status,
                adminNotes: adminNotes || undefined,
            },
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error("Error updating report:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
