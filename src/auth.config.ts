import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from "next-auth"
import { db } from '@/src/lib/db'
import bcrypt from "bcryptjs"

// Notice this is only an object, not a full Auth.js instance
export default {
   providers: [
      Credentials({
         authorize: async (credentials) => {
            const user = await db.user.findUnique({
               where: {
                  email: credentials.email as string
               }
            })

            if (!user || !user.password) throw new Error("Invalid credentials")

            const isValid = await bcrypt.compare(credentials.password as string, user.password as string)

            if (!isValid) throw new Error("Invalid credentials")

            return user
         }
      }),
   ],
} satisfies NextAuthConfig