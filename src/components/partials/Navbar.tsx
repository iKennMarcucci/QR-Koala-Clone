"use client"

import { usePathname } from "next/navigation"
import { Plus, QrCode } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
   const pathname = usePathname()
   const hideNavbar = ["/login", "/register"].includes(pathname)

   if (hideNavbar) return null

   return (
      <header className="border-white/10 border-b flex justify-center">
         <div className="container flex h-16 items-center max-w-7xl px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
               <QrCode className="h-6 w-6" />
               QR Koala Clone
            </Link>
            <nav className="font-semibold text-sm items-center ml-auto flex gap-4">
               <Link href="/dashboard" className="hover:bg-[#272727] duration-100 py-2.5 px-4 rounded-md">
                  Dashboard
               </Link>
               <Link href="/create" className="text-black bg-[#fafafa] hover:bg-[#e2e2e2] duration-100 flex items-center gap-2 py-2.5 px-4 rounded-md">
                  <Plus className="h-4 w-4" />
                  Create QR
               </Link>
            </nav>
         </div>
      </header>
   )
}

// max-w-7xl px-6 mx-auto