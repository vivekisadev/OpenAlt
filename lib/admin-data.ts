import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cached function to fetch all tools or tools by filter
// We use a general cache key 'admin-tools-list' and differentiate by filter in arguments
export const getCachedTools = unstable_cache(
    async (filter: string | null) => {
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

        return tools.map((t: any) => ({
            ...t,
            tags: t.tags ? t.tags.split(",") : [],
            features: t.features ? t.features.split(",") : [],
            submitter: t.user
        }));
    },
    ['admin-tools-list'],
    {
        tags: ['admin-tools'],
        revalidate: 60
    }
);
