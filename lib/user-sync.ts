import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getPrismaUser() {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
        console.error("user-sync: No email found for user");
        return null;
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { email },
    });

    const isVerified = clerkUser.emailAddresses[0]?.verification?.status === "verified";

    if (!user) {
        // Create new user if not exists
        // We set a dummy password because the schema requires it
        user = await prisma.user.create({
            data: {
                email,
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || "Anonymous",
                password: "clerk-authenticated-user",
                role: "USER",
                isVerified
            }
        });
    } else {
        // Sync latest details from Clerk
        const clerkName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || "Anonymous";

        const needsUpdate = user.name !== clerkName || user.isVerified !== isVerified;

        if (needsUpdate) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: clerkName,
                    isVerified
                }
            });
        }
    }

    return user;
}
