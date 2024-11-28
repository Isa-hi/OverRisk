"use client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { ClothingItemCard } from "@/types";
import Link from "next/link";

type props = {
  clothingItems: ClothingItemCard[]
}
export default function ClothesStoreCards({ clothingItems }: props) {
  

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
              
              <Link href={`/clothe-details/${item.id}`} className="flex w-full rounded-md bg-black text-white p-2 pl-5 hover:bg-orange-500 transition-colors">
                Ver detalles
                <ChevronRightIcon />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
