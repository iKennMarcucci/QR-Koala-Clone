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

      const qrCode = await db.qrCode.findMany({
         where: {
            userId: userExists.id
         }
      })

      const data = { qrCode: qrCode }

      return NextResponse.json({ data })
   } catch (error) {
      return NextResponse.json({ error: "Error getting Folders data" }, { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const session = await auth()
      const body = await req.json()

      const userExists = await db.user.findUnique({
         where: { email: session?.user?.email as string }
      })

      if (!userExists) return NextResponse.json({ error: "User does not exist" }, { status: 400 })


      const data = await db.qrCode.create({
         data: { userId: userExists.id, ...body },
      })

      return NextResponse.json({ data })

   } catch (error) {
      console.log("error", error)
      return NextResponse.json({ error: "Error getting Folders data" }, { status: 500 })
   }
}