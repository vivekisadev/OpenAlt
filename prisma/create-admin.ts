import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
});

async function main() {
    const email = 'uservivek20@gmail.com';
    const password = 'password123'; // Temporary password
    const hashedPassword = await hash(password, 12);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: { role: 'ADMIN' },
            create: {
                email,
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log(`Admin user created/updated: ${user.email}`);
        console.log(`Password: ${password}`);
    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
