import { PrismaClient } from '@prisma/client'
import { seedTools } from '../lib/seed-data'

const prisma = new PrismaClient()

async function main() {
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    try {
        // console.log('Clearing existing tools...');
        // await prisma.tool.deleteMany({});

        console.log(`Seeding ${seedTools.length} tools...`);
        for (const tool of seedTools) {
            // handle array fields if necessary, currently tags/features are arrays in seed data but strings in schema?
            // Schema: tags String, features String?
            // Seed data: tags: string[], features: string[]

            const toolData = {
                ...tool,
                tags: Array.isArray(tool.tags) ? tool.tags.join(',') : tool.tags,
                features: Array.isArray(tool.features) ? tool.features.join(',') : tool.features,
            };

            const existingTool = await prisma.tool.findFirst({
                where: { name: tool.name }
            });

            if (existingTool) {
                console.log(`Updating ${tool.name}...`);
                await prisma.tool.update({
                    where: { id: existingTool.id },
                    data: toolData,
                });
            } else {
                console.log(`Creating ${tool.name}...`);
                await prisma.tool.create({
                    data: toolData,
                });
            }
        }

        console.log('Seeding finished.')
    } catch (error) {
        console.error('Error in main:', error);
        throw error;
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
