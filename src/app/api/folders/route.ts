import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
   try {
      const body = await request.json()
      const { name, userId } = body

      const folder = await prisma.folder.create({
         data: {
            name,
            userId,
         },
      })

      return NextResponse.json(folder)
   } catch (error) {
      console.error("Error creating folder:", error)
      return NextResponse.json({ error: "Error creating folder" }, { status: 500 })
   }
}

export async function PUT(request: Request) {
   try {
      const body = await request.json()
      const { id, name } = body

      const updatedFolder = await prisma.folder.update({
         where: { id },
         data: { name },
      })

      return NextResponse.json(updatedFolder)
   } catch (error) {
      console.error("Error updating folder:", error)
      return NextResponse.json({ error: "Error updating folder" }, { status: 500 })
   }
}