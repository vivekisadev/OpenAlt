import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { tools: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedUsers = users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u as any).role,
            toolCount: u._count.tools,
            createdAt: u.createdAt
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
