import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
});

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.log("Usage: npx tsx prisma/make-admin.ts <email>");
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' } as any
        });
        console.log(`User ${user.email} is now an ADMIN.`);
    } catch (error) {
        console.error("Error updating user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
