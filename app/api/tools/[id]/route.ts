import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const tool = await prisma.tool.findUnique({
            where: { id: params.id }
        });

        if (!tool) {
            return NextResponse.json({ message: "Tool not found" }, { status: 404 });
        }

        // Format tags/features
        const formattedTool = {
            ...tool,
            tags: tool.tags ? tool.tags.split(",") : [],
            features: tool.features ? tool.features.split(",") : [],
        };

        return NextResponse.json(formattedTool);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
