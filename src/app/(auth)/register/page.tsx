"use client"

import { registerAction } from "@/src/auth-actions"
import AuthLink from "@/src/components/ui/authLink"
import { Input } from "@/src/components/ui/input"
import { QrCode } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { toast } from "sonner"

export default function Register() {
   const router = useRouter()
   const name = useRef<HTMLInputElement>(null)
   const email = useRef<HTMLInputElement>(null)
   const password = useRef<HTMLInputElement>(null)

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault()
      try {
         const response = await registerAction(name.current?.value ?? '', email.current?.value ?? '', password.current?.value ?? '')
         if (!response.success) {
            toast("Oops", {
               description: "Something went wrong!"
            })
         } else {
            toast("Success", {
               description: "You have successfully registered!"
            })
            router.push("/dashboard")
         }
      } catch (error) {
         toast("Oops", {
            description: "Something went wrong!"
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
               <h5 className="font-semibold text-3xl">Sign up</h5>
               <div className="flex text-xs gap-1 mt-2">
                  <p className="text-white/50">Already have an account?</p>
                  <Link href={"/login"} className="hover:font-semibold duration-100">Log in here!</Link>
               </div>

               <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                     <label htmlFor="Name" className="text-sm font-semibold">Name</label>
                     <Input ref={name} id="Name" type="text" placeholder="Example: Kenn Marcucci" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label htmlFor="Email" className="text-sm font-semibold">Email</label>
                     <Input ref={email} id="Email" type="email" placeholder="Example: kennmarcucci@gmail.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label htmlFor="Password" className="text-sm font-semibold">Password</label>
                     <Input ref={password} id="Password" type="password" />
                  </div>

                  <button type="submit" className="text-black bg-[#fafafa] hover:bg-[#e2e2e2] text-sm font-semibold 
                        duration-100 flex justify-center items-center gap-2 py-2.5 px-4 rounded-md mt-2 cursor-pointer">
                     Sign up
                  </button>
               </form>
            </div>
         </section>
         <AuthLink />
      </div>
   )
}