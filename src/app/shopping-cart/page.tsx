"use client"
import { useState } from 'react'
import Image from 'next/image'
import { ArrowRightIcon, MinusIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Product {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export default function Component() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Radiant Glow Serum", price: 49.99, image: "/placeholder.svg?height=100&width=100", quantity: 1 },
    { id: 2, name: "Velvet Matte Lipstick", price: 24.99, image: "/placeholder.svg?height=100&width=100", quantity: 2 },
    { id: 3, name: "Silk Smooth Foundation", price: 39.99, image: "/placeholder.svg?height=100&width=100", quantity: 1 },
  ])

  const updateQuantity = (id: number, change: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity: Math.max(0, product.quantity + change) } : product
    ).filter(product => product.quantity > 0))
  }

  const subtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-amber-100 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-6 py-2 text-white bg-orange-600 w-3/4 sm:w-1/2 mx-auto">Tu carrito</h1>
          {products.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            <>
              {products.map((product) => (
                <div key={product.id} className="flex items-center py-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    <h2 className="font-semibold text-lg">{product.name}</h2>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(product.id, -1)}
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 w-8 text-center">{product.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(product.id, 1)}
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateQuantity(product.id, -product.quantity)}
                      className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-300"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">Subtotal</span>
                <span className="font-bold text-xl">${subtotal.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                Proceder al pago
                <ArrowRightIcon className="size-6" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}