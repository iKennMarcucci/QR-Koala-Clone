"use client"

import QRCodeStyling, { Options } from "qr-code-styling"
import styles from "../../../../public/page.module.css"
import { useEffect, useRef, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { ColorPicker } from "@/src/components/ui/color-picker"
import { Switch } from "@/src/components/ui/switch"
import { useRouter } from "next/navigation"


export default function QRCreate() {
   const router = useRouter()

   const [options, setOptions] = useState<Options>({
      width: 200,
      height: 200,
      type: 'svg',
      data: 'https://example.com',
      image: '',
      margin: 10,
      shape: "square",
      qrOptions: {
         mode: 'Byte',
         errorCorrectionLevel: 'H'
      },
      imageOptions: {
         hideBackgroundDots: true,
         imageSize: 0.3,
         margin: 0,
         crossOrigin: 'anonymous',
         saveAsBlob: true,
      },
      dotsOptions: {
         color: '#000000',
         type: 'square',
      },
      cornersSquareOptions: {
         color: '#000000',
         type: 'square',
      },
      cornersDotOptions: {
         color: '#000000',
         type: 'square',
      },
      backgroundOptions: {
         color: '#ffffff',
      },
   })
   const [qrCode, setQrCode] = useState<QRCodeStyling>()
   const [folders, setFolders] = useState<{ id: string; name: string }[]>([])

   const ref = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const loadData = async () => {
         try {
            const response = await fetch("/api/folders")
            const { data } = await response.json()
            setFolders(data.folders)
         } catch (error) {
            console.error(error)
         }
      }
      loadData()
   }, [])

   useEffect(() => {
      setQrCode(new QRCodeStyling(options))
   }, [])

   useEffect(() => {
      if (ref.current) {
         qrCode?.append(ref.current)
      }
   }, [qrCode, ref])

   useEffect(() => {
      if (!qrCode) return
      qrCode?.update(options)
   }, [qrCode, options])

   const onDownloadClick = () => {
      if (!qrCode) return
      qrCode.download()
   }

   const [showLogoSwitch, setShowLogoSwitch] = useState(false)
   const [showFrameSwitch, setShowFrameSwitch] = useState(false)
   const [showDotsSwitch, setShowDotsSwitch] = useState(false)
   const [showSquareSwitch, setShowSquareSwitch] = useState(false)
   const [showCornerDotsSwitch, setShowCornerDotsSwitch] = useState(false)

   const updateQRCodeOption: (key: string, value: any) => void = (key: string, value: any) => {
      setOptions((prevOptions) => {
         const keys = key.split('.');
         if (keys.length === 1) {
            return {
               ...prevOptions,
               [key]: value,
            };
         } else {
            const [firstKey, secondKey] = keys;
            return {
               ...prevOptions,
               [firstKey]: {
                  ...(prevOptions[firstKey as keyof Options] as any),
                  [secondKey]: value,
               },
            };
         }
      });
   }

   const qrName = useRef<HTMLInputElement>(null)
   const qrLink = useRef<HTMLInputElement>(null)
   const [qrFolder, setQrFolder] = useState("none")

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {

         const qrCodeData = {
            name: qrName?.current?.value,
            url: qrLink?.current?.value,
            options: JSON.stringify(options),
            includeLogo: showLogoSwitch,
            includeFrame: showFrameSwitch,
            frameText: "Frame",
            folderId: qrFolder,
         }

         const response = await fetch("/api/qr", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(qrCodeData),
         })

         router.push("/dashboard")
      } catch (error) {
         console.error("Failed to create QR Code:", error)
         alert("Failed to create QR Code. Please try again.")
      }
   }

   return (
      <section className="max-w-3xl px-6 mx-auto mt-10 w-full">
         <h3 className="font-bold text-3xl tracking-tight">Create QR Code</h3>
         <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="border-white/10 border rounded-md p-6">
               <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="basic">
                     <TabsList className="bg-[#272727] text-white/50 duration-100 grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="style">Style</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                     </TabsList>

                     <TabsContent value="basic" className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-col gap-2">
                           <label htmlFor="QRName" className="text-sm font-semibold">QR Code Name</label>
                           <Input ref={qrName} id="QRName" placeholder="My QR Code" required/>
                           <p className="text-white/50 text-xs">A name to help you identify this QR code.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                           <label htmlFor="QRLink" className="text-sm font-semibold">URL</label>
                           <Input ref={qrLink} id="QRLink" placeholder={options.data} onChange={(event) => updateQRCodeOption("data", event.target.value)} required />
                           <p className="text-white/50 text-xs">The URL this QR code will link to when scanned.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                           <label htmlFor="Folder" className="text-sm font-semibold">Folder (Optional)</label>
                           <Select onValueChange={(value: string) => setQrFolder(value)}>
                              <SelectTrigger id={"Folder"}>
                                 <SelectValue placeholder="Select a folder" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="none">None</SelectItem>
                                 {
                                    folders.map((folder) => (
                                       <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                                    ))
                                 }
                              </SelectContent>
                           </Select>
                           <p className="text-white/50 text-xs">Organize your QR code in a folder.</p>
                        </div>
                     </TabsContent>

                     <TabsContent value="style" className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-col gap-2">
                           <label htmlFor="QRCode" className="text-sm font-semibold">Background Color</label>
                           <ColorPicker value={(options.backgroundOptions?.color ?? "#ffffff").toUpperCase()} onChange={(value: string) => updateQRCodeOption("backgroundOptions.color", value)} />
                        </div>

                        <div className="flex flex-col gap-2">
                           <label htmlFor="QRStyle" className="text-sm font-semibold">QR Style</label>
                           <Select defaultValue={options.shape} onValueChange={(value: string) => updateQRCodeOption("shape", value)}>
                              <SelectTrigger id={"QRStyle"} >
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="square">Square</SelectItem>
                                 <SelectItem value="circle">Circle</SelectItem>
                              </SelectContent>
                           </Select>
                           <p className="text-white/50 text-xs">Choose the visual style of your QR code.</p>
                        </div>

                        <div onClick={() => setShowDotsSwitch(!showDotsSwitch)} className="border-white/10 hover:bg-[#272727] duration-100 
                        select-none cursor-pointer flex justify-between items-center rounded-md border p-4">
                           <div className="flex flex-col mr-2">
                              <label className="text-lg font-semibold">Dots Options</label>
                              <p className="text-white/50 text-xs">Change the visual style of the dots on your QR Code.</p>
                           </div>
                           {
                              showDotsSwitch ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />
                           }
                        </div>

                        {
                           showDotsSwitch && (
                              <div className="flex flex-col gap-2">
                                 <>
                                    <label htmlFor="QRDotColor" className="text-sm font-semibold">Dots Color</label>
                                    <ColorPicker value={(options.dotsOptions?.color ?? "#000000").toUpperCase()} onChange={(value: string) => updateQRCodeOption("dotsOptions.color", value)} />
                                 </>
                                 <>
                                    <label htmlFor="QRDotStyle" className="text-sm font-semibold">Dots Style</label>
                                    <Select defaultValue={options.dotsOptions?.type} onValueChange={(value: string) => updateQRCodeOption("dotsOptions.type", value)}>
                                       <SelectTrigger id={"QRDotStyle"}>
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="square">Square</SelectItem>
                                          <SelectItem value="rounded">Rounded</SelectItem>
                                          <SelectItem value="dots">Dots</SelectItem>
                                          <SelectItem value="classy">Classy</SelectItem>
                                          <SelectItem value="classy-rounded">Classy-Rounded</SelectItem>
                                          <SelectItem value="extra-rounded">Extra-Rounded</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </>
                              </div>
                           )
                        }

                        <div onClick={() => setShowSquareSwitch(!showSquareSwitch)} className="border-white/10 hover:bg-[#272727] duration-100 
                        select-none cursor-pointer flex justify-between items-center rounded-md border p-4">
                           <div className="flex flex-col mr-2">
                              <label className="text-lg font-semibold">Squares Options</label>
                              <p className="text-white/50 text-xs">Change the visual style of the squares on your QR Code.</p>
                           </div>
                           {
                              showSquareSwitch ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />
                           }
                        </div>

                        {
                           showSquareSwitch && (
                              <div className="flex flex-col gap-2">
                                 <>
                                    <label htmlFor="QRSquareColor" className="text-sm font-semibold">Square Color</label>
                                    <ColorPicker value={(options.cornersSquareOptions?.color ?? "#000000").toUpperCase()}
                                       onChange={(value: string) => updateQRCodeOption("cornersSquareOptions.color", value)} />
                                 </>
                                 <>
                                    <label htmlFor="QRSquareStyle" className="text-sm font-semibold">Square Style</label>
                                    <Select defaultValue={options.cornersSquareOptions?.type}
                                       onValueChange={(value: string) => updateQRCodeOption("cornersSquareOptions.type", value)}>
                                       <SelectTrigger id={"QRSquareStyle"}>
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="square">Square</SelectItem>
                                          <SelectItem value="dots">Dots</SelectItem>
                                          <SelectItem value="dot">Dot</SelectItem>
                                          <SelectItem value="classy">Classy</SelectItem>
                                          <SelectItem value="rounded">Rounded</SelectItem>
                                          <SelectItem value="classy-rounded">Classy-Rounded</SelectItem>
                                          <SelectItem value="extra-rounded">Extra-Rounded</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </>
                              </div>
                           )
                        }

                        <div onClick={() => setShowCornerDotsSwitch(!showCornerDotsSwitch)} className="border-white/10 hover:bg-[#272727] duration-100 
                        select-none cursor-pointer flex justify-between items-center rounded-md border p-4">
                           <div className="flex flex-col mr-2">
                              <label className="text-lg font-semibold">Corner Dots Options</label>
                              <p className="text-white/50 text-xs">Change the visual style of the corner dots on your QR Code.</p>
                           </div>
                           {
                              showCornerDotsSwitch ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />
                           }
                        </div>

                        {
                           showCornerDotsSwitch && (
                              <div className="flex flex-col gap-2">
                                 <>
                                    <label htmlFor="QRCornerDotsColor" className="text-sm font-semibold">Corner Dots Color</label>
                                    <ColorPicker value={(options.cornersDotOptions?.color ?? "#000000").toUpperCase()}
                                       onChange={(value: string) => updateQRCodeOption("cornersDotOptions.color", value)} />
                                 </>
                                 <>
                                    <label htmlFor="QRCornerDotsStyle" className="text-sm font-semibold">Corner Dots Style</label>
                                    <Select defaultValue={options.cornersDotOptions?.type}
                                       onValueChange={(value: string) => updateQRCodeOption("cornersDotOptions.type", value)}>
                                       <SelectTrigger id={"QRCornerDotsStyle"}>
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="square">Square</SelectItem>
                                          <SelectItem value="dots">Dots</SelectItem>
                                          <SelectItem value="dot">Dot</SelectItem>
                                          <SelectItem value="classy">Classy</SelectItem>
                                          <SelectItem value="rounded">Rounded</SelectItem>
                                          <SelectItem value="classy-rounded">Classy-Rounded</SelectItem>
                                          <SelectItem value="extra-rounded">Extra-Rounded</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </>
                              </div>
                           )
                        }
                     </TabsContent>

                     <TabsContent value="advanced" className="flex flex-col gap-4 mt-4">
                        <div className="border-white/10 flex justify-between items-center rounded-md border p-4">
                           <div className="flex flex-col">
                              <label className="text-lg font-semibold">Add Logo</label>
                              <p className="text-white/50 text-xs">Add a logo to the center of your QR code.</p>
                           </div>
                           <Switch checked={showLogoSwitch} onCheckedChange={() => setShowLogoSwitch(!showLogoSwitch)} />
                        </div>
                        {
                           showLogoSwitch && (
                              <div className="flex flex-col gap-2">
                                 <label htmlFor="LogoFile" className="text-sm font-semibold">Upload Logo</label>
                                 <Input type="file" accept="image/*" id="LogoFile" onChange={(event) => updateQRCodeOption("image", event.target.files ? URL.createObjectURL(event.target.files[0]) : "")} />
                                 <p className="text-white/50 text-xs">For best results, use a square image with a transparent background.</p>
                              </div>
                           )
                        }

                        <div className="border-white/10 flex justify-between items-center rounded-md border p-4">
                           <div className="flex flex-col">
                              <label className="text-lg font-semibold">Add Frame</label>
                              <p className="text-white/50 text-xs">Add a frame around your QR code with customizable text.</p>
                           </div>
                           <Switch checked={showFrameSwitch} onCheckedChange={() => setShowFrameSwitch(!showFrameSwitch)} />
                        </div>
                        {
                           showFrameSwitch && (
                              <div className="flex flex-col gap-2">
                                 <label htmlFor="Frame" className="text-sm font-semibold">Frame Text</label>
                                 <Input type="text" id="Frame" placeholder="Scan me!" />
                                 <p className="text-white/50 text-xs">Text to display around the QR code frame.</p>
                              </div>
                           )
                        }
                     </TabsContent>
                     <button type="submit" className="text-black bg-[#fafafa] hover:bg-[#e2e2e2] text-sm font-semibold 
                        duration-100 flex justify-center items-center gap-2 py-2.5 px-4 rounded-md mt-2 cursor-pointer">
                        Create QR Code
                     </button>
                  </Tabs>
               </form>
            </div>
            <div className="border-white/10 border rounded-md p-6">
               <h4 className="font-semibold text-xl text-center mb-4">Preview</h4>
               <>
                  <div className={styles.qrWrapper} ref={ref} />
                  <div className="flex flex-col gap-4 mt-4">
                     <h6 className="text-white/60 text-center text-sm">{options.data}</h6>
                     <button onClick={onDownloadClick} type="submit" className="border-[#272727] hover:bg-[#272727] text-sm font-semibold w-full border
                        duration-100 flex justify-center items-center gap-2 py-2.5 px-4 rounded-md mt-2 cursor-pointer">
                        Download
                     </button>
                     <p className="text-white/50 text-xs text-center">This is a preview. Create the QR code to download and track scans.</p>
                  </div>
               </>
            </div>
         </div>
      </section>
   )
}