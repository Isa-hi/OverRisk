'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Product } from '@prisma/client'

const images = [
  { src: '/placeholder.svg?height=600&width=400', alt: 'Front view' },
  { src: '/placeholder.svg?height=600&width=400', alt: 'Back view' },
]

type props = {
    item: Product;
};
export default function ImageGallery({ item }: props) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
        <Image
          src={item.image}
          alt="Imagen del producto"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex justify-center space-x-2">
        {images.map((image, index) => (
          <Button
            key={index}
            variant={currentImage === index ? "default" : "outline"}
            onClick={() => setCurrentImage(index)}
          >
            {index === 0 ? 'Frente' : 'Atrás'}
          </Button>
        ))}
      </div>
    </div>
  )
}

