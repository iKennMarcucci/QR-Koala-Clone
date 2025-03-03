import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
   try {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get("userId")

      if (!userId) {
         return NextResponse.json({ error: "User ID is required" }, { status: 400 })
      }

      const folders = await prisma.folder.findMany({
         where: { userId },
         include: { qrCodes: true },
      })

      const qrCodes = await prisma.qrCode.findMany({
         where: { userId },
         include: { scans: true },
      })

      return NextResponse.json({ folders, qrCodes })
   } catch (error) {
      console.error("Error fetching dashboard data:", error)
      return NextResponse.json({ error: "Error fetching dashboard data" }, { status: 500 })
   }
}