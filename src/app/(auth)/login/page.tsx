"use client"

import Link from "next/link"
import { QrCode } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import AuthLink from "@/src/components/ui/authLink"
import { useRef } from "react"
import { loginAction } from "@/src/auth-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function Login() {
   const router = useRouter()
   const email = useRef<HTMLInputElement>(null)
   const password = useRef<HTMLInputElement>(null)

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault()
      try {
         const response = await loginAction(email.current?.value ?? '', password.current?.value ?? '')
         if (!response.success) {
            toast("Error", {
               description: "No user exists with these credentials"
            })
         } else {
            router.push("/dashboard")
         }
      } catch (error) {
         toast("Error", {
            description: "No user exists with these credentials"
         })
      }
   }
   return (
      <div className="flex justify-center items-center h-screen overflow-hidden">
         <section className="flex justify-center items-center w-full h-screen relative">
            <Link href="/" className="flex items-center gap-2 font-semibold absolute top-10 left-10">
               <QrCode className="h-6 w-6" />
               QR Koala Clone
            </Link>

            <div className="max-w-1/3 w-full">
               <h5 className="font-semibold text-3xl">Log in</h5>
               <div className="flex text-xs gap-1 mt-2">
                  <p className="text-white/50">Don't have an account?</p>
                  <Link href={"/register"} className="hover:font-semibold duration-100">Sign up here!</Link>
               </div>

               <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                     <label htmlFor="Email" className="text-sm font-semibold">Email</label>
                     <Input ref={email} id="Email" type="email" placeholder="example@gmail.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label htmlFor="Password" className="text-sm font-semibold">Password</label>
                     <Input ref={password} id="Password" type="password" />
                  </div>

                  <button type="submit" className="text-black bg-[#fafafa] hover:bg-[#e2e2e2] text-sm font-semibold 
                        duration-100 flex justify-center items-center gap-2 py-2.5 px-4 rounded-md mt-2 cursor-pointer">
                     Log in
                  </button>
               </form>
            </div>
         </section>

         <AuthLink />
      </div>
   )
}