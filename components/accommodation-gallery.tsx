"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface AccommodationGalleryProps {
  images: string[]
}

export function AccommodationGallery({ images }: AccommodationGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openGallery = (index: number) => {
    setCurrentImageIndex(index)
    setIsOpen(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] relative">
        <div className="md:col-span-2 md:row-span-2 relative rounded-lg overflow-hidden">
          <img
            src={images[0] || "/placeholder.svg"}
            alt="ภาพหลักของที่พัก"
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
            onClick={() => openGallery(0)}
          />
        </div>

        {images.slice(1, 4).map((image, index) => (
          <div key={index} className="relative rounded-lg overflow-hidden hidden md:block">
            <img
              src={image || "/placeholder.svg"}
              alt={`ภาพที่พัก ${index + 2}`}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
              onClick={() => openGallery(index + 1)}
            />
            {index === 2 && images.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium">+{images.length - 4} รูป</span>
              </div>
            )}
          </div>
        ))}

        <button
          className="absolute bottom-4 right-4 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-opacity-100 transition-all"
          onClick={() => openGallery(0)}
        >
          ดูรูปภาพทั้งหมด ({images.length})
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black">
          <div className="relative h-[80vh]">
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-70 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-center h-full">
              <button
                className="absolute left-4 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-70 transition-all"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <img
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`ภาพที่พัก ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              <button
                className="absolute right-4 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-70 transition-all"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
