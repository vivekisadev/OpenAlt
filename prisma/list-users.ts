import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
});

async function main() {
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
    users.forEach(u => console.log(`- ${u.email} (${(u as any).role})`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
