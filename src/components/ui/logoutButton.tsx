"use client"

import { signOut } from "next-auth/react"

export const LogoutButton = () => {
   const handleClick = async () => {
      await signOut({
         redirectTo: "/login"
      })
   }

   return (
      <button onClick={handleClick} className="text-black bg-[#fafafa] hover:bg-[#e2e2e2] text-sm font-semibold 
   duration-100 flex justify-center items-center gap-2 py-2.5 px-4 rounded-md mt-2 cursor-pointer">
         Log out
      </button>
   )
}