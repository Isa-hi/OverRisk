"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { useMutation } from "@tanstack/react-query";
import { addProductToShoppingCart } from "@/app/actions";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { ClothingItemCard } from "@/types";
import { Product } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

type props = {
  user: KindeUser<Record<string, any>>
  clothingItems: ClothingItemCard[]
}
export default function ClothesStoreCards({ user, clothingItems }: props) {
  const { toast } = useToast()

  const { mutate } = useMutation({
    mutationFn: async (productId : Product['id']) => await addProductToShoppingCart(user.id, productId),
    onSuccess: () => {
      toast({
        title: "Producto añadido al carrito",
        className: "bg-green-400 border-green-500 text-white",
      })
    }
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-orange-700 w-1/2 mx-auto p-2 text-white">Nuestra colección</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {clothingItems.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardHeader></CardHeader>
            <CardContent>
              <AspectRatio ratio={1 / 1}>
                <div className="w-full h-44 relative bg-cover contain-content">
                  <Image fill src={item.image} alt={""} />
                </div>
              </AspectRatio>
              <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
              <p className="text-primary font-medium">
                ${item.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => mutate(item.id)} >
                <ShoppingCart className="mr-2 h-4 w-4" /> Añadir al carrito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
