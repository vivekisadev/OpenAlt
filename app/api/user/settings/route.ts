import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hash, compare } from "bcryptjs";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, email, currentPassword, newPassword } = await req.json();
        const userId = (session.user as any).id;

        // Get current user data
        const currentUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!currentUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const updateData: any = { name, email };

        // Handle password change
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ message: "Current password is required to set a new password" }, { status: 400 });
            }

            const isPasswordValid = await compare(currentPassword, currentUser.password);
            if (!isPasswordValid) {
                return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
            }

            updateData.password = await hash(newPassword, 12);
        }

        // Check if email is taken (if changed)
        if (email !== currentUser.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return NextResponse.json({ message: "Email already in use" }, { status: 400 });
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                email: updatedUser.email
            }
        });

    } catch (error) {
        console.error("Settings update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
