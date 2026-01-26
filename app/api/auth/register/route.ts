import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, username, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name: username || email.split("@")[0],
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "User created successfully", user: { email: user.email, name: user.name } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
