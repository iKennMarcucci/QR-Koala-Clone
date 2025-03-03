import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/src/auth.config"
import { db } from "@/src/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(db),
   ...authConfig,
   session: { strategy: "jwt" },
})