import { NextResponse } from "next/server"
import { auth } from "@/src/auth"
import { db } from "@/src/lib/db"

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

      const data = { folders: folders }

      return NextResponse.json({ data })
   } catch (error) {
      return NextResponse.json({ error: "Error getting Folders data" }, { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const session = await auth()

      const body = await req.json()
      const { name } = body

      const userExists = await db.user.findUnique({
         where: { email: session?.user?.email as string }
      })

      if (!userExists) return NextResponse.json({ error: "User does not exist" }, { status: 400 })

      const data = await db.folder.create({
         data: {
            name,
            userId: userExists.id
         }
      })

      return NextResponse.json({ data })

   } catch (error) {
      console.log("error", error)
      return NextResponse.json({ error: "Error creating folder" }, { status: 500 })
   }
}

export async function PUT(req: Request) {
   try {
      const session = await auth()

      const body = await req.json()
      const { folderId, newFolderName } = body

      const userExists = await db.user.findUnique({
         where: { email: session?.user?.email as string }
      })

      if (!userExists) return NextResponse.json({ error: "User does not exist" }, { status: 400 })

      const folderExists = await db.folder.findUnique({
         where: { id: folderId }
      })

      if (!folderExists) return NextResponse.json({ error: "Folder does not exist" }, { status: 400 })

      const data = await db.folder.update({
         where: {
            id: folderId
         },
         data: {
            name: newFolderName
         }
      })

      return NextResponse.json({ data })

   } catch (error) {
      console.log("error", error)
      return NextResponse.json({ error: "Error updating folder" }, { status: 500 })
   }
}