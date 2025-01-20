import prisma from "@/prisma/client";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) {
          return false;
        }
        const userFromDb = await prisma.user.findFirst({
          where: { email: profile.email },
        });
        if (!userFromDb) {
          await prisma.user.create({
            data: { email: profile.email, name: profile.name ?? ""},
          });
        }
      }
      return true;
    },
    async jwt({ token }) {
      const userFromDb = await prisma.user.findFirst({
        where: { email: token.email as string },
      });
      token = { ...token, activated: userFromDb?.activated ?? false};
      return token;
    },
    async session({ session, token }) {
      return {...session, user: {...session.user, activated: token.activated}};
    },
  },
};
