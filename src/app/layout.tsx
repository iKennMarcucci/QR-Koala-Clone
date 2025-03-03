
import { Onest } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "../components/partials/Navbar"
import Footer from "../components/partials/Footer"
import { Toaster } from "@/src/components/ui/sonner"

const onest = Onest({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "QR Koala Clone",
  description: 'Practical test of the company "La Fábrica LTD"',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${onest.className} antialiased`}>
        <main className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
          <Navbar />
          {children}
          <Footer />
        </main>
        <Toaster />
      </body>
    </html>
  )
}
