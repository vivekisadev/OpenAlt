import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
});

async function main() {
    const tools = [
        {
            name: "Pending Tool 1",
            category: "Development",
            description: "A pending tool for testing.",
            url: "https://example.com",
            logo: "https://via.placeholder.com/150",
            approved: false,
            userId: null,
            tags: "test,pending",
            features: "Feature 1,Feature 2",
            pricing: "Free"
        },
        {
            name: "Pending Tool 2",
            category: "Design",
            description: "Another pending tool.",
            url: "https://example.com",
            logo: "https://via.placeholder.com/150",
            approved: false,
            userId: null,
            tags: "design,pending",
            features: "Feature A,Feature B",
            pricing: "Paid"
        }
    ];

    for (const tool of tools) {
        await prisma.tool.create({ data: tool });
    }
    console.log("Created pending tools");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
