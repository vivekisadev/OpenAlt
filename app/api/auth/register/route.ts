import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
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

        const body = await req.json();

        // Input Validation
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email, username, password } = validation.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Check if username is taken (optional, but good practice if unique)
        if (username) {
            const existingUsername = await prisma.user.findFirst({
                where: { name: username }
            });
            if (existingUsername) {
                return NextResponse.json({ message: "Username is already taken" }, { status: 409 });
            }
        }

        const hashedPassword = await hash(password, 12); // Increased cost factor for better security

        const user = await prisma.user.create({
            data: {
                email,
                name: username,
                password: hashedPassword,
                role: "USER" // Explicit default
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
