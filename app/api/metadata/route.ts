import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; OpenAltBot/1.0)",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();

        // Simple regex extraction
        const getMetaContent = (name: string) => {
            const regex = new RegExp(`<meta\\s+(?:name|property)=["']${name}["']\\s+content=["'](.*?)["']`, "i");
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        const getTitle = () => {
            const match = html.match(/<title>(.*?)<\/title>/i);
            return match ? match[1] : null;
        };

        const title = getTitle() || getMetaContent("og:title") || "";
        const description = getMetaContent("description") || getMetaContent("og:description") || "";
        const image = getMetaContent("og:image") || getMetaContent("twitter:image") || "";
        const logo = getMetaContent("og:logo") || ""; // Rare but possible

        return NextResponse.json({
            title,
            description,
            image,
            logo
        });

    } catch (error: any) {
        console.error("Metadata fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
    }
}
