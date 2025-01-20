import prisma from "@/prisma/client";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    callbacks: {
        signIn: async ({user, account, profile}) => {
            if (account?.provider === "google") {
                const userFromDb = await prisma.user.findFirst({where: {email: profile?.email!}});
                if (!userFromDb) {
                    await prisma.user.create({data: {email: profile?.email!, name: profile?.name!}});
                }
            }
            return true;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ]
}