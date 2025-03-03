"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { BarChart, Download, Edit, Folder, FolderPlus, Grid, List, MoreHorizontal, Plus, QrCode, Search, Trash2 } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

import styles from "../../../../public/page.module.css"
import QRCodeStyling, { Options } from "qr-code-styling"

export default function Dashboard() {
   const ref = useRef<{ [key: string]: HTMLDivElement | null }>({})
   const [qrCodesState, setQrCodesState] = useState<{ [key: string]: QRCodeStyling }>({})
   const [searchQuery, setSearchQuery] = useState("")
   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
   const [folders, setFolders] = useState<{ id: string; name: string }[]>([])
   const [qrCodes, setQrCodes] = useState<{ id: string; name: string; url: string; scanCount: number; createdAt: string; folderId: string; imageUrl: string; options: Options }[]>([])
   const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
   const [isLoading, setIsLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
   const [newFolderName, setNewFolderName] = useState("")

   useEffect(() => {
      const loadData = async () => {
         try {
            const response = await fetch("/api/dashboard")
            const { data } = await response.json()

            setFolders(data.folders)
            setQrCodes(data.qrs)

            setIsLoading(false)
         } catch (err) {
            setError("Failed to load data. Please try again.")
            setIsLoading(false)
         }
      }
      loadData()
   }, [])

   useEffect(() => {
      Object.keys(ref.current).forEach((key) => {
         if (ref.current[key] && qrCodesState[key]) {
            qrCodesState[key].append(ref.current[key]);
         }
      });
   }, [qrCodesState]);

   useEffect(() => {
      const newQrCodesState: { [key: string]: QRCodeStyling } = {};
      qrCodes.forEach((qr) => {
         newQrCodesState[qr.id] = new QRCodeStyling(qr.options);
      });
      setQrCodesState(newQrCodesState);
   }, [qrCodes]);

   useEffect(() => {
      Object.keys(qrCodesState).forEach((key) => {
         if (qrCodesState[key]) {
            qrCodesState[key].update(qrCodes.find((qr) => qr.id === key)?.options);
         }
      });
   }, [qrCodesState, qrCodes]);


   const filteredQrCodes = qrCodes.filter((qr) => {
      const matchesSearch =
         qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         qr.url.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFolder = selectedFolder ? qr.folderId === selectedFolder : true
      return matchesSearch && matchesFolder
   })

   const handleCreateFolder = async () => {
      const newFolder = { name: `New Folder ${folders.length + 1}`, }

      try {
         const response = await fetch("/api/folders", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(newFolder),
         })

         const { data } = await response.json()

         setFolders([...folders, { ...newFolder, id: data.id }])
         toast(`Folder Created`, {
            description: "New folder has been created.",
         })
      } catch (error) {
         toast("Error", {
            description: "Failed to create folder. Please try again.",
         })
      }
   }

   const handleDeleteQrCode = (id: string) => {
      setQrCodes(qrCodes.filter((qr) => qr.id !== id))

      toast("QR Code Deleted", {
         description: "QR code has been deleted.",
      })
   }

   const handleEditFolderName = (folderId: string, currentName: string) => {
      setEditingFolderId(folderId)
      setNewFolderName(currentName)
   }

   const handleSaveFolderName = async (folderId: string) => {
      try {
         await fetch(`/api/folders`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ folderId, newFolderName }),
         })
         setFolders(folders.map((folder) => (folder.id === folderId ? { ...folder, name: newFolderName } : folder)))
         setEditingFolderId(null)
         toast("Folder Updated", {
            description: "Folder name has been updated successfully.",
         })
      } catch (error) {
         toast("Error", {
            description: "Failed to update folder name. Please try again."
         })
      }
   }

   if (isLoading) {
      return <div>Loading...</div>
   }

   if (error) {
      return <div>Error: {error}</div>
   }

   return (
      <section className="max-w-7xl px-6 mx-auto mt-10 w-full space-y-6">
         <div className="flex justify-between items-center">
            <h3 className="font-bold text-3xl tracking-tight">My QR Codes</h3>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     type="search"
                     placeholder="Search QR codes..."
                     className="w-full sm:w-[300px] pl-8"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <button className="border-white/10 hover:bg-[#272727] duration-100 rounded-md p-2.5 border cursor-pointer"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                  {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
               </button>
            </div>
         </div>
         <div className="flex gap-10">
            <aside className="flex flex-col w-3xs gap-4">
               <div className="flex justify-between items-center">
                  <h6 className="text-lg font-medium">Folders</h6>
                  <button onClick={handleCreateFolder} className="hover:bg-[#272727] duration-100 rounded-md p-2.5 cursor-pointer">
                     <FolderPlus className="h-4 w-4" />
                  </button>
               </div>

               <div className="text-white/50 duration-100 flex flex-col h-full w-full p-0 gap-1">
                  <button onClick={() => setSelectedFolder(null)}
                     className={`${selectedFolder === null ? "bg-[#272727] text-white font-medium" : "hover:bg-[#272727]"} 
                     w-full p-2.5 gap-2.5 cursor-pointer flex justify-start items-center duration-100 rounded-md`}>
                     <QrCode className="h-4 w-4" />
                     All QR Codes
                  </button>
                  {
                     folders.map((folder) => (
                        <div key={folder.id} className="flex items-center">
                           {
                              editingFolderId === folder.id ? (
                                 <div className="flex justify-between items-center w-full gap-2.5">
                                    <Input
                                       value={newFolderName}
                                       onChange={(e) => setNewFolderName(e.target.value)}
                                       className="w-full"
                                    />
                                    <button className="text-sm cursor-pointer" onClick={() => handleSaveFolderName(folder.id)}>
                                       Save
                                    </button>
                                 </div>
                              ) : (
                                 <div className="flex justify-between items-center w-full gap-1">
                                    <button key={folder.id} onClick={() => setSelectedFolder(folder.id)}
                                       className={`${selectedFolder === folder.id ? "bg-[#272727] text-white font-medium" : "hover:bg-[#272727]"} 
                                       w-full p-2.5 gap-2.5 cursor-pointer flex justify-start items-center duration-100 rounded-md`}>
                                       <Folder className="mr-2 h-4 w-4" />
                                       {folder.name}
                                    </button>
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild className="hover:bg-[#272727] p-3.5 cursor-pointer rounded-md duration-100">
                                          <button>
                                             <MoreHorizontal className="h-4 w-4" />
                                          </button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent className="border-white/10 bg-[#0a0a0a] text-white hover:bg-[#272727] duration-100 border">
                                          <DropdownMenuItem onClick={() => handleEditFolderName(folder.id, folder.name)}>
                                             <Edit className="mr-2 h-4 w-4" /> Rename
                                          </DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>
                              )
                           }
                        </div>
                     ))
                  }
               </div>
            </aside>

            <article className="flex flex-col w-full gap-4">
               <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-[#272727] text-white/50 duration-100 space-x-2">
                     <TabsTrigger value="all">All QR Codes</TabsTrigger>
                     <TabsTrigger value="recent">Recently Created</TabsTrigger>
                     <TabsTrigger value="popular">Most Scanned</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-6">
                     {filteredQrCodes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                           <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                           <h3 className="text-lg font-medium">No QR Codes Found</h3>
                           <p className="text-muted-foreground mt-2 mb-4">
                              {searchQuery ? "Try a different search term" : "Create your first QR code to get started"}
                           </p>
                           <Link href="/create">
                              <button className="bg-white text-black flex items-center p-2 rounded-sm">
                                 <Plus className="mr-2 h-4 w-4" /> Create QR Code
                              </button>
                           </Link>
                        </div>
                     ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                           {filteredQrCodes.map((qrCode) => (
                              <Card key={qrCode.id}>
                                 <CardContent>
                                    <div className="bg-white/10 flex justify-center items-center py-2 w-32 h-32 object-contain justify-self-center">
                                       <div className={styles.qrWrapper} ref={(el) => { ref.current[qrCode.id] = el }} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                                       <div className="flex items-center">
                                          <BarChart className="h-4 w-4 mr-1" />
                                          {qrCode.scanCount} scans
                                       </div>
                                       <div>{new Date(qrCode.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                       <button className="hover:bg-[#272727] border-white/10 py-1.5 px-2.5 rounded-md border duration-100 cursor-pointer">
                                          <Link href={`/qr/${qrCode.id}`}>View</Link>
                                       </button>
                                       <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                             <button>
                                                <MoreHorizontal className="h-4 w-4" />
                                             </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                             <DropdownMenuItem asChild>
                                                <Link href={`/qr/${qrCode.id}/edit`}>
                                                   <Edit className="h-4 w-4 mr-2" /> Edit
                                                </Link>
                                             </DropdownMenuItem>
                                             <DropdownMenuItem>
                                                <Download className="h-4 w-4 mr-2" /> Download
                                             </DropdownMenuItem>
                                             <DropdownMenuSeparator />
                                             <DropdownMenuItem className="text-destructive focus:text-destructive"
                                                onClick={() => handleDeleteQrCode(qrCode.id)}
                                             >
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>
                                    </div>
                                 </CardContent>
                              </Card>
                           ))}
                        </div>
                     ) : (
                        <div className="space-y-2">
                           {filteredQrCodes.map((qrCode) => (
                              <div key={qrCode.id} className="flex items-center justify-between p-3 border rounded-lg">
                                 <div className="flex items-center gap-3">
                                    <div className={styles.qrWrapper} ref={(el) => { ref.current[qrCode.id] = el }} />
                                    <div>
                                       <h3 className="font-medium">{qrCode.name}</h3>
                                       <p className="text-sm text-muted-foreground">{qrCode.url}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <div className="text-sm text-muted-foreground mr-4">
                                       <span className="flex items-center">
                                          <BarChart className="h-4 w-4 mr-1" />
                                          {qrCode.scanCount} scans
                                       </span>
                                    </div>
                                    <button>
                                       <Link href={`/qr/${qrCode.id}`}>View</Link>
                                    </button>
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <button>
                                             <MoreHorizontal className="h-4 w-4" />
                                          </button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end">
                                          <DropdownMenuItem asChild>
                                             <Link href={`/qr/${qrCode.id}/edit`}>
                                                <Edit className="h-4 w-4 mr-2" /> Edit
                                             </Link>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                             <Download className="h-4 w-4 mr-2" /> Download
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                             className="text-destructive focus:text-destructive"
                                             onClick={() => handleDeleteQrCode(qrCode.id)}
                                          >
                                             <Trash2 className="h-4 w-4 mr-2" /> Delete
                                          </DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </TabsContent>
                  <TabsContent value="recent" className="mt-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredQrCodes
                           .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                           .map((qrCode) => (
                              <Card key={qrCode.id}>
                                 <CardContent>
                                    <div className="flex justify-center py-2">
                                       <img
                                          src={qrCode.imageUrl || "/placeholder.svg"}
                                          alt={qrCode.name}
                                          className="w-32 h-32 object-contain"
                                       />
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                                       <div className="flex items-center">
                                          <BarChart className="h-4 w-4 mr-1" />
                                          {qrCode.scanCount} scans
                                       </div>
                                       <div>{new Date(qrCode.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                       <button className="hover:bg-[#272727] border-white/10 py-1.5 px-2.5 rounded-md border duration-100 cursor-pointer">
                                          <Link href={`/qr/${qrCode.id}`}>View</Link>
                                       </button>
                                       <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                             <button>
                                                <MoreHorizontal className="h-4 w-4" />
                                             </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                             <DropdownMenuItem asChild>
                                                <Link href={`/qr/${qrCode.id}/edit`}>
                                                   <Edit className="h-4 w-4 mr-2" /> Edit
                                                </Link>
                                             </DropdownMenuItem>
                                             <DropdownMenuItem>
                                                <Download className="h-4 w-4 mr-2" /> Download
                                             </DropdownMenuItem>
                                             <DropdownMenuSeparator />
                                             <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => handleDeleteQrCode(qrCode.id)}
                                             >
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>
                                    </div>
                                 </CardContent>
                              </Card>
                           ))}
                     </div>
                  </TabsContent>
                  <TabsContent value="popular" className="mt-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredQrCodes
                           .sort((a, b) => b.scanCount - a.scanCount)
                           .map((qrCode) => (
                              <Card key={qrCode.id}>
                                 <CardContent>
                                    <div className="flex justify-center py-2">
                                       <img
                                          src={qrCode.imageUrl || "/placeholder.svg"}
                                          alt={qrCode.name}
                                          className="w-32 h-32 object-contain"
                                       />
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                                       <div className="flex items-center">
                                          <BarChart className="h-4 w-4 mr-1" />
                                          {qrCode.scanCount} scans
                                       </div>
                                       <div>{new Date(qrCode.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                       <button className="hover:bg-[#272727] border-white/10 py-1.5 px-2.5 rounded-md border duration-100 cursor-pointer">
                                          <Link href={`/qr/${qrCode.id}`}>View</Link>
                                       </button>
                                       <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                             <button>
                                                <MoreHorizontal className="h-4 w-4" />
                                             </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                             <DropdownMenuItem asChild>
                                                <Link href={`/qr/${qrCode.id}/edit`}>
                                                   <Edit className="h-4 w-4 mr-2" /> Edit
                                                </Link>
                                             </DropdownMenuItem>
                                             <DropdownMenuItem>
                                                <Download className="h-4 w-4 mr-2" /> Download
                                             </DropdownMenuItem>
                                             <DropdownMenuSeparator />
                                             <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => handleDeleteQrCode(qrCode.id)}
                                             >
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>
                                    </div>
                                 </CardContent>
                              </Card>
                           ))}
                     </div>
                  </TabsContent>
               </Tabs>
            </article>
         </div>
      </section>
   )
}