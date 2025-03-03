import { NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { auth } from "@/src/auth"

export async function GET() {
   try {
      const session = await auth()

      const userExists = await db.user.findUnique({
         where: { email: session?.user?.email as string }
      })

      if (!userExists) return NextResponse.json({ error: "User does not exist" }, { status: 400 })

      const folders = await db.folder.findMany({
         where: {
            userId: userExists.id
         }
      })

      const qrs = await db.qrCode.findMany({
         where: {
            userId: userExists.id
         }
      })

      const data = {
         folders: folders,
         qrs: qrs
      }

      return NextResponse.json({ data })
   } catch (error) {
      return NextResponse.json({ error: "Error getting Dashboard data" }, { status: 500 })
   }
}