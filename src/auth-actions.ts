"use server"

import { signIn } from "@/src/auth"
import { db } from "@/src/lib/db"
import bcrypt from "bcryptjs"

export const loginAction = async (email: string, password: string) => {
   try {
      await signIn("credentials", {
         email: email,
         password: password,
         redirect: false
      })

      return { success: true }
   } catch (error) {
      throw new Error("Invalid credentials")
   }
}

export const registerAction = async (name: string, email: string, password: string) => {
   try {
      const user = await db.user.findUnique({
         where: {
            email: email
         }
      })

      if (user) throw new Error("User already exists!")

      const hashPwd = await bcrypt.hash(password, 10)

      await db.user.create({
         data: {
            name: name,
            email: email,
            password: hashPwd
         }
      })

      await signIn("credentials", {
         email: email,
         password: password,
         redirect: false
      })

      return { success: true }
   } catch (error) {
      throw new Error("Something went wrong!")
   }
}