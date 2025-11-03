import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        console.log("Admin API Session:", JSON.stringify(session, null, 2));

        if (!session || session.user.role !== 'ADMIN') {
            console.log("Unauthorized access attempt. Role:", (session?.user as any)?.role);
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter'); // 'pending' | 'all'

        const where = filter === 'all' ? {} : { approved: false };

        const tools = await prisma.tool.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            } as any
        });

        const formattedTools = tools.map((t: any) => ({
            ...t,
            tags: t.tags ? t.tags.split(",") : [],
            features: t.features ? t.features.split(",") : [],
            submitter: t.user
        }));

        return NextResponse.json(formattedTools);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Check if user is admin
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id, action, reason } = await req.json();

        if (action === 'approve') {
            await prisma.tool.update({
                where: { id },
                data: { approved: true, rejectionReason: null }
            });
        } else if (action === 'reject') {
            await prisma.tool.update({
                where: { id },
                data: { approved: false, rejectionReason: reason }
            });
        } else {
            return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin action error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: "Missing id" }, { status: 400 });
        }

        await prisma.tool.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin delete error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
