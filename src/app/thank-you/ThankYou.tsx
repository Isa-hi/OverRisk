"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "./actions";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function ThankYou() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [queryKey, setQueryKey] = useState(["get-payment-status"]);
  const [retryCount, setRetryCount] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 2000,
  });

  useEffect(() => {
    if (data === false && retryCount < 3) {
      const timer = setTimeout(() => {
        setQueryKey(["get-payment-status"]);
        setRetryCount(retryCount + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [data, retryCount]);

  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Cargando tu orden...</h3>
          <p>Esto no tardará mucho</p>
        </div>
      </div>
    );
  }

  if (data === false && retryCount >= 3) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold text-xl">No se pudo verificar tu pago</h3>
          <p>Por favor, inténtalo de nuevo más tarde</p>
        </div>
      </div>
    );
  }

  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verificando tu pago...</h3>
          <p>Esto podría tomar un momento</p>
        </div>
      </div>
    );
  }

  if (data) {
    const { config, billingAddress, shippingAddress, amount } = data;

    return (
      <>
        <div className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-xl">
              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                Tu orden está en camino
              </p>
              <h1 className="text-base font-medium text-primary">
                ¡Gracias por tu compra!
              </h1>
              <p className="mt-2 text-base text-zinc-500">
                Tu orden ha sido confirmada y la estamos procesando.
              </p>

              <div className="mt-12 text-sm font-medium">
                <p className="text-zinc-900">Número de orden: </p>
                <p className="text-zinc-500 mt-2">{orderId}</p>
              </div>
            </div>

            <div className="mt-10 border-t border-zinc-200">
                <div className="mt-10 flex flex-auto flex-col">
                    <h4 className="font-semibold text-zinc-900">
                        ¡Hiciste una buena elección!
                    </h4>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
                    <div>
                        <p className="font-semibold text-gray-900">
                            Dirección de envío
                        </p>
                        <div className="mt-2 text-zinc-700">
                            <address className="not-italic">
                                <span className="block"> {shippingAddress?.name} </span>
                                <span className="block"> {shippingAddress?.street} , {shippingAddress?.postalCode} </span>
                                <span className="block"> {shippingAddress?.city}, {shippingAddress?.state} </span>

                            </address>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">
                            Dirección de facturación
                        </p>
                        <div className="mt-2 text-zinc-700">
                            <address className="not-italic">
                                <span className="block"> {billingAddress?.name} </span>
                                <span className="block"> {billingAddress?.street} , {billingAddress?.postalCode} </span>
                                <span className="block"> {billingAddress?.city}, {billingAddress?.state} </span>
                            </address>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      Estado del pago
                    </p>
                    <p className="mt-2 text-zinc-700">
                      Pagado
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">
                      Métodos de envío
                    </p>
                    <p className="mt-2 text-zinc-700">
                      DHL, puede tardar hasta 5 días hábiles
                    </p>
                  </div>
                </div>

                <div className="space-y-6 border-t border-zinc-200 pt-10 tex-sm">
                  <div className="flex justify-between">
                    <p className="font-medium text-zinc-900">Subtotal</p>
                    <p className="text-zinc-700">{formatPrice(amount / 100)} </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium text-zinc-900">Envío</p>
                    <p className="text-zinc-700">{formatPrice(0)} </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-bold text-zinc-900">Total</p>
                    <p className="font-bold text-zinc-700">{formatPrice(amount / 100)} </p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
