import Image from "next/image"
import Link from "next/link"
import iphone from "../../../public/iphone.png"
import { QrCode } from "lucide-react"

export default function AuthLink() {
   return (
      <Link href={'/'} className="bg-white text-black flex justify-center items-center w-8/12 h-screen relative">
         <Image src={iphone} alt="iphone" className="w-96 translate-y-48" />
         <div className="absolute flex flex-col items-center translate-y-24">
            <div className="flex items-center gap-2 font-bold text-3xl">
               QR Koala Clone
            </div>
            <QrCode className="h-48 w-48" />
            <h5 className="text-center font-semibold text-xl">Try the best QR code <br />generator on the market</h5>
            <ul className="flex flex-col items- gap-2 mt-2">
               <li><b>•</b> 10 free one-day trials.</li>
               <li><b>•</b> No credit card required.</li>
               <li><b>•</b> Access to all featuress.</li>
            </ul>
         </div>
      </Link>
   )
}