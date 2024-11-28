"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addProductToShoppingCart, getUser } from "@/app/actions";
import { Product } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

type props = {
  item: Product;
};

export default function ProductDetails({ item }: props) {
  const { toast } = useToast();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await getUser();
      return user;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (productId: Product["id"]) => {
      if (user?.id) {
        await addProductToShoppingCart(user.id, productId);
      } else {
        throw new Error("User ID is undefined");
      }
    },
    onSuccess: () => {
      toast({
        title: "Producto añadido al carrito",
        className: "bg-green-400 border-green-500 text-white",
      });
    },
  });

  const [size, setSize] = useState("");  

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{item.name}</h1>
      <p className="text-2xl font-semibold">{formatPrice(item.price)} </p>
        <p className="text-lg">{item.description}</p>
      <div className="space-y-2">
        <label
          htmlFor="size-select"
          className="block text-sm font-medium text-gray-700"
        >
          Selecciona una talla
        </label>
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger id="size-select" className="w-1/2">
            <SelectValue placeholder="Elige una talla" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">XS</SelectItem>
            <SelectItem value="s">S</SelectItem>
            <SelectItem value="m">M</SelectItem>
            <SelectItem value="l">L</SelectItem>
            <SelectItem value="xl">XL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full" onClick={() => mutate(item.id)}>
        <ShoppingCart className="mr-2 h-4 w-4" /> Añadir al carrito
      </Button>
    </div>
  );
}
