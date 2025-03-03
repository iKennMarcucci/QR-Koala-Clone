import { ArrowRight, ChartSpline, Cog, FolderTree, HeartHandshake, QrCode, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <section className="flex justify-between items-center h-[720px] w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-2.5">
          <h1 className="font-bold text-6xl tracking-tight">Create Unlimited <br /> Custom QR Codes</h1>
          <p className="text-white/50 text-xl">
            Generate beautiful, customizable QR codes for free.<br />Track scans, add logos, text, and more.
          </p>
          <div className="flex gap-4 mt-2 self-start">
            <Link href="/create" className="text-black bg-[#fafafa] hover:bg-[#e2e2e2] flex items-center gap-4 border duration-100
          py-2.5 px-4 rounded-md text-sm">
              Create Your First QR Code
              <ArrowRight className="h-4 w-4" color="#000" />
            </Link>
            <Link href="/dashboard" className="hover:bg-[#272727] border-[#272727] border duration-100 py-2.5 px-4 rounded-md text-sm font-normal tracking-normal">
              Go to Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-zinc-400 aspect-square h-80 rounded-md shadow-xl breathing">
          <QrCode className="aspect-square h-full w-full" color="#0a0a0a" />
        </div>
      </section>

      <section className="bg-[#272727] flex flex-col justify-center items-center h-[720px] gap-20">
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-semibold text-5xl tracking-tight">Features</h2>
          <p className="text-white/50 text-xl">Everything you need to create and manage your QR codes</p>
        </div>

        <div className="grid grid-cols-3 gap-20 max-w-5xl">
          <div className="flex flex-col items-center gap-2.5">
            <span className="bg-[#3c3c3c] p-3 rounded-full">
              <QrCode className="h-6 w-6" color="#fff" />
            </span>
            <h3 className="font-semibold text-xl">Unlimited QR Codes</h3>
            <p className="text-white/50 text-center text-sm">Create as many QR codes as you need, completely free.</p>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <span className="bg-[#3c3c3c] p-3 rounded-full">
              <Cog className="h-6 w-6" color="#fff" />
            </span>
            <h3 className="font-semibold text-xl">Full Customization</h3>
            <p className="text-white/50 text-center text-sm">Add logos, text, frames, and choose from various styles.</p>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <span className="bg-[#3c3c3c] p-3 rounded-full">
              <ChartSpline className="h-6 w-6" color="#fff" />
            </span>
            <h3 className="font-semibold text-xl">Scan Analytics</h3>
            <p className="text-white/50 text-center text-sm">Track how many times your QR codes are scanned.</p>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <span className="bg-[#3c3c3c] p-3 rounded-full">
              <FolderTree className="h-6 w-6" color="#fff" />
            </span>
            <h3 className="font-semibold text-xl">Folder Organization</h3>
            <p className="text-white/50 text-center text-sm">Organize your QR codes into folders with drag and drop.</p>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <span className="bg-[#3c3c3c] p-3 rounded-full">
              <ShieldCheck className="h-6 w-6" color="#fff" />
            </span>
            <h3 className="font-semibold text-xl">Secure Storage</h3>
            <p className="text-white/50 text-center text-sm">All your QR codes are securely stored and accessible anytime.</p>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <span className="bg-[#3c3c3c] p-3 rounded-full">
              <HeartHandshake className="h-6 w-6" color="#fff" />
            </span>
            <h3 className="font-semibold text-xl">100% Free</h3>
            <p className="text-white/50 text-center text-sm">No hidden fees or premium features. Everything is included.</p>
          </div>
        </div>
      </section>
    </>
  )
}
