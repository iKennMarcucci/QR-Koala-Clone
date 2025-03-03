"use client"

import { usePathname } from "next/navigation"

export default function Footer() {
   const pathname = usePathname()
   const hideNavbar = ["/login", "/register"].includes(pathname)

   if (hideNavbar) return null
   return (
      <footer className="flex justify-center items-center h-20 text-center text-sm leading-loose text-muted-foreground md:text-left">
         © {new Date().getFullYear()} QR Koala Clone. No rights reserved.
      </footer>
   )
}