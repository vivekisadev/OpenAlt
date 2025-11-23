const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL,
        },
    },
})

async function main() {
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    try {
        const tools = [
            {
                name: "VS Code",
                category: "Development",
                description: "Code editing. Redefined.",
                longDescription: "Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.",
                url: "https://code.visualstudio.com/",
                githubUrl: "https://github.com/microsoft/vscode",
                tags: "editor,ide,microsoft,opensource",
                logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg",
                features: "IntelliSense,Run and Debug,Built-in Git,Extensions",
                pricing: "Free",
                approved: true,
            },
            {
                name: "Next.js",
                category: "Development",
                description: "The React Framework for the Web",
                longDescription: "Used by some of the world's largest companies, Next.js enables you to create full-stack Web applications by extending the latest React features.",
                url: "https://nextjs.org/",
                githubUrl: "https://github.com/vercel/next.js",
                tags: "react,framework,web,vercel",
                logo: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png",
                features: "Routing,Rendering,Data Fetching,Styling",
                pricing: "Free",
                approved: true,
            },
            {
                name: "Supabase",
                category: "Database",
                description: "The Open Source Firebase Alternative",
                longDescription: "Supabase is an open source Firebase alternative. Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage, and Vector embeddings.",
                url: "https://supabase.com/",
                githubUrl: "https://github.com/supabase/supabase",
                tags: "database,postgres,firebase-alternative,opensource",
                logo: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png",
                features: "Database,Auth,Storage,Realtime",
                pricing: "Freemium",
                approved: true,
            }
        ]

        for (const tool of tools) {
            await prisma.tool.create({
                data: tool,
            })
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
