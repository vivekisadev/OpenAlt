import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL,
        },
    },
});

async function main() {
    try {
        console.log("Checking database connection...");

        // 1. Check for pending tools
        const pendingTools = await prisma.tool.findMany({
            where: { approved: false },
        });
        console.log(`Found ${pendingTools.length} pending tools.`);
        if (pendingTools.length > 0) {
            console.log("Sample pending tool:", JSON.stringify(pendingTools[0], null, 2));
        }

        // 2. Check for admin user
        const adminEmail = "uservivek20@gmail.com"; // The user mentioned earlier
        const user = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (user) {
            console.log(`User ${adminEmail} found. Role: ${(user as any).role}`);
        } else {
            console.log(`User ${adminEmail} NOT found.`);
        }

        // 3. List all users to see who is admin
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' }
        });
        console.log(`Found ${admins.length} admin users:`, admins.map(u => u.email));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
