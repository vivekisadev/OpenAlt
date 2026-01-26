
import { prisma } from "./lib/prisma";

async function main() {
    try {
        const totalTools = await prisma.tool.count();
        const approvedTools = await prisma.tool.count({ where: { approved: true } });
        const pendingTools = await prisma.tool.count({ where: { approved: false } });

        console.log("Total Tools:", totalTools);
        console.log("Approved Tools:", approvedTools);
        console.log("Pending Tools:", pendingTools);

        const sample = await prisma.tool.findFirst({ where: { approved: true } });
        if (sample) {
            console.log("Sample tool:", sample.name);
        } else {
            console.log("No approved tools found.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
