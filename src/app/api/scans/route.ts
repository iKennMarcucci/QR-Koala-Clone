import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
   try {
      const body = await request.json()
      const { qrCodeId, ipAddress, userAgent } = body

      const scan = await prisma.scan.create({
         data: {
            qrCodeId,
            ipAddress,
            userAgent,
         },
      })

      // Incrementar el contador de escaneos del código QR
      // await prisma.qrCode.update({
      //    where: { id: qrCodeId },
      //    data: { scanCount: { increment: 1 } },
      // })

      return NextResponse.json(scan)
   } catch (error) {
      console.error("Error recording scan:", error)
      return NextResponse.json({ error: "Error recording scan" }, { status: 500 })
   }
}