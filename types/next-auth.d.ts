import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            activated: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        activated: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends Record<string, unknown>, DefaultJWT{
        activated: boolean;
    }
}