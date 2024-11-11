"use client";

import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowRight, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import type { Configuration } from "@prisma/client";
import LoginModal from "@/components/LoginModal";

type DesignPreviewProps = {
  configuration: Configuration;
};

export default function DesignPreview({ configuration }: DesignPreviewProps) {
  const router = useRouter();
  const {toast} = useToast();
  const { id } = configuration;
  const { user } = useKindeBrowserClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [showConfetti, setshowConfetti] = useState(false);
  useEffect(() => {
    setshowConfetti(true);
  });
  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 200,
    dragFriction: 0.09,
    duration: 3000,
    stagger: 3,
    width: "15px",
    height: "25px",
    perspective: "501px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  const { mutate: createPaymentSessionMutation } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({url}) => {
      if(url) {
        router.push(url);
      } else {
        throw new Error("No se pudo crear la sesión de pago");
      }
    },
    onError: () => {
      toast({
        title: "Algo salió mal",
        description: "Hubo un error en nuestra plataforma, por favor intenta de nuevo",
        variant: "destructive"
      })
    }
  })

  const handleCheckout = () => {
    if(user) {
      createCheckoutSession(id);
    } else {
      localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
    }

  }

  return (
    <>
      <div
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
        aria-hidden="true"
      >
        <Confetti active={showConfetti} config={confettiConfig} />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen}/>

      <div className="my-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Card
            className={
              "relative col-span-2 w-full max-w-4xl mx-auto overflow-hiddenrounded-2xl text-center"
            }
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="relative w-full h-full">
                <AspectRatio ratio={1282 / 1515} className="w-full">
                  <Image
                    fill
                    src={configuration.croppedImgUrl!}
                    alt="T-shirt mockup"
                    className="object-cover pointer-events-none select-none"
                    priority
                  />
                </AspectRatio>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Resumen de tu pedido
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="size-6 text-green-500" /> Envío gratis y listo
            para ser enviado
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-semibold text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Diseño personalizado y exclusivo</li>
                <li>Impresión de alta calidad </li>
                <li>Envío gratuito</li>
              </ol>
            </div>

            <div>
              <p className="font-semibold text-zinc-950">Materiales</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Impresión digital de alta resolución</li>
                <li>Tela resistente y duradera</li>
                <li>Tacto suave y agradable</li>
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-zinc-700">Subtotal</p>
                  <p className="text-zinc-700 ">
                    {formatPrice(configuration.price!)}
                  </p>
                </div>

                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-zinc-700">Envío</p>
                  <p className="text-zinc-700 ">Gratis</p>
                </div>

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-zinc-700 font-semibold">Total</p>
                  <p className="text-zinc-700 font-semibold">
                    {formatPrice(configuration.price!)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button onClick={handleCheckout} className="px-4 sm:px-6 lg:px-8">
                Proceder al pago <ArrowRight className="size-5 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
