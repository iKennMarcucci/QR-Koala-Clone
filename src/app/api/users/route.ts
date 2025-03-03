import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
   try {
      const body = await request.json()
      const { email, name } = body

      const user = await prisma.user.create({
         data: {
            email,
            name,
         },
      })

      return NextResponse.json(user)
   } catch (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ error: "Error creating user" }, { status: 500 })
   }
}