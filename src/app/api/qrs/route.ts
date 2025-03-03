import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
   try {
      const body = await request.json()
      const { name, url, options, includeLogo, includeFrame, frameText, userId, folderId } = body

      const qrCode = await prisma.qrCode.create({
         data: {
            name,
            url,
            options,
            includeLogo,
            includeFrame,
            frameText,
            userId,
            folderId,
         },
      })

      return NextResponse.json(qrCode)
   } catch (error) {
      console.error("Error creating QR code:", error)
      return NextResponse.json({ error: "Error creating QR code" }, { status: 500 })
   }
}

export async function PUT(request: Request) {
   try {
      const body = await request.json()
      const { id, ...updateData } = body

      const updatedQrCode = await prisma.qrCode.update({
         where: { id },
         data: updateData,
      })

      return NextResponse.json(updatedQrCode)
   } catch (error) {
      console.error("Error updating QR code:", error)
      return NextResponse.json({ error: "Error updating QR code" }, { status: 500 })
   }
}

export async function DELETE(request: Request) {
   try {
      const { searchParams } = new URL(request.url)
      const id = searchParams.get("id")

      if (!id) {
         return NextResponse.json({ error: "QR code ID is required" }, { status: 400 })
      }

      await prisma.qrCode.delete({
         where: { id },
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      console.error("Error deleting QR code:", error)
      return NextResponse.json({ error: "Error deleting QR code" }, { status: 500 })
   }
}