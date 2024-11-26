"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, getUserShoppingCart, removeProductFromShoppingCart } from "../actions";
import { Product } from "@prisma/client";

export default function ShoppingCartComponent() {
  const queryClient = useQueryClient();
  const updateQuantity = async (productId: number, quantity: number) => {}

  const { data: userData, isError: isErrorUserData} = useQuery({
    queryKey: ["userData"],
    queryFn: async () => await getUser(),
    retry: 1,
  });

  const { data, isError, isPending } = useQuery({
    queryKey: ["shoppingCart"],
    queryFn: async () => userData ? await getUserShoppingCart(userData.id) : null,
    retry: 1,
    enabled: !!userData,
  });

  const { mutate } = useMutation({
    mutationFn: (productId : Product['id']) => removeProductFromShoppingCart(userData!.id, productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shoppingCart"] }),
  });

  const handleRemoveProduct = (productId: Product['id']) => {
    mutate(productId);
  }

  if (isErrorUserData || !userData) {
    return <p>Ha ocurrido un error. Inténtalo más tarde. Error </p>;
  }

  if (isPending) return <p>Cargando...</p>;
  if (isError) return <p>Ha ocurrido un error. Inténtalo más tarde. Error </p>;

  if (data)
    return (
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-6 py-2 text-white bg-orange-600 w-3/4 sm:w-1/2 mx-auto">
            Tu carrito
          </h1>
          {data.products.length === 0 ? (
            <p className="text-center text-gray-500">Tu carrito está vacío</p>
          ) : (
            <>
              {data.products.map((product) => (
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
                    <p className="text-sm text-gray-600">
                      ${product.price.toFixed(2)}
                    </p>
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
                    <span className="mx-2 w-8 text-center">{}</span>
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
                      onClick={() =>
                        handleRemoveProduct(product.id)
                    }
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
                <span className="font-bold text-xl">$</span>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                Proceder al pago
                <ArrowRightIcon className="size-6" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
}
