"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/src/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Input } from "@/src/components/ui/input"

interface ColorPickerProps {
   value: string
   onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
   const [color, setColor] = useState(value || "#000000")
   const inputRef = useRef<HTMLInputElement>(null)

   useEffect(() => {
      setColor(value)
   }, [value])

   const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value
      setColor(newColor)
      onChange(newColor)
   }

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button variant="outline" className="bg-[#0a0a0a] border-white/10 hover:bg-[#272727] hover:text-white cursor-pointer 
        w-full justify-start text-left font-normal h-10">
               <div className="flex items-center gap-2">
                  <div className="border-white/10 h-4 w-4 rounded-full border" style={{ backgroundColor: color }} />
                  <span>{color}</span>
               </div>
            </Button>
         </PopoverTrigger>
         <PopoverContent className="bg-[#0a0a0a] border-white/10 w-64">
            <div className="flex flex-col gap-2">
               <div className="w-full h-24 rounded-md overflow-hidden">
                  <input
                     ref={inputRef}
                     type="color"
                     value={color}
                     onChange={handleColorChange}
                     className="w-full h-full cursor-pointer"
                  />
               </div>
               <div className="flex gap-2">
                  <Input value={color} onChange={handleColorChange} className="text-white flex-1" />
               </div>
               <div className="grid grid-cols-8 gap-1">
                  {["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"].map(
                     (presetColor) => (
                        <button
                           key={presetColor}
                           className="w-6 h-6 rounded-full border overflow-hidden"
                           style={{ backgroundColor: presetColor }}
                           onClick={() => {
                              setColor(presetColor)
                              onChange(presetColor)
                           }}
                        />
                     ),
                  )}
               </div>
            </div>
         </PopoverContent>
      </Popover>
   )
}

