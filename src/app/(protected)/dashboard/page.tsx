"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Edit, Folder, FolderPlus, Grid, List, MoreHorizontal, QrCode, Search } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"

const mockQrCodes = [
   {
      id: "1",
      name: "Company Website",
      url: "https://example.com",
      scanCount: 245,
      createdAt: "2023-05-15T10:30:00Z",
      folderId: "1",
      imageUrl: "/placeholder.svg?height=200&width=200",
   },
   {
      id: "2",
      name: "Product Catalog",
      url: "https://example.com/products",
      scanCount: 187,
      createdAt: "2023-06-22T14:45:00Z",
      folderId: "2",
      imageUrl: "/placeholder.svg?height=200&width=200",
   },
   {
      id: "3",
      name: "Contact Information",
      url: "https://example.com/contact",
      scanCount: 103,
      createdAt: "2023-07-10T09:15:00Z",
      folderId: "3",
      imageUrl: "/placeholder.svg?height=200&width=200",
   },
   {
      id: "4",
      name: "Special Offer",
      url: "https://example.com/offer",
      scanCount: 321,
      createdAt: "2023-08-05T16:20:00Z",
      folderId: "1",
      imageUrl: "/placeholder.svg?height=200&width=200",
   },
   {
      id: "5",
      name: "Event Registration",
      url: "https://example.com/event",
      scanCount: 156,
      createdAt: "2023-09-18T11:10:00Z",
      folderId: "2",
      imageUrl: "/placeholder.svg?height=200&width=200",
   },
]

export default function Dashboard() {
   const [searchQuery, setSearchQuery] = useState("")
   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
   const [folders, setFolders] = useState<{ id: string; name: string }[]>([])
   const [qrCodes, setQrCodes] = useState(mockQrCodes)
   const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)
   const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
   const [newFolderName, setNewFolderName] = useState("")

   // useEffect(() => {
   //    const loadData = async () => {
   //       try {
   //          const data = await getDashboardData("1")
   //          setFolders(data.folders)
   //          setQrCodes(data.qrCodes.map((qr: any) => ({
   //             ...qr,
   //             createdAt: qr.createdAt.toISOString(),
   //             imageUrl: qr.imageUrl || "/placeholder.svg?height=200&width=200"
   //          })))
   //          setIsLoading(false)
   //       } catch (err) {
   //          setError("Failed to load data. Please try again.")
   //          setIsLoading(false)
   //       }
   //    }
   //    loadData()
   // }, [])

   const filteredQrCodes = qrCodes.filter((qr) => {
      const matchesSearch =
         qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         qr.url.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFolder = selectedFolder ? qr.folderId === selectedFolder : true
      return matchesSearch && matchesFolder
   })

   const handleCreateFolder = async () => {
      const newFolder = {
         id: `folder-${Date.now()}`,
         name: `New Folder ${folders.length + 1}`,
      }

      try {
         // const userId = "1" // Replace with the actual user ID
         // const createdFolder = await createFolder(newFolder.name, userId)
         // setFolders([...folders, { ...newFolder, id: createdFolder.id }])
         // toast("Folder Created", {
         //    description: "New folder has been created.",
         // })
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
         // await updateFolderName(folderId, newFolderName)
         // setFolders(folders.map((folder) => (folder.id === folderId ? { ...folder, name: newFolderName } : folder)))
         // setEditingFolderId(null)
         // toast("Folder Updated", {
         //    description: "Folder name has been updated successfully.",
         // })
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
         <aside className="flex flex-col max-w-3xs gap-4">
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
      </section>
   )
}