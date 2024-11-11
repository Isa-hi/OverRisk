"use client";

import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import Image from "next/image";
import { Configuration } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type DesignPreviewProps = {
  configuration: Configuration;
};

export default function DesignPreview({ configuration }: DesignPreviewProps) {
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
  return (
    <>
      <div
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
        aria-hidden="true"
      >
        <Confetti active={showConfetti} config={confettiConfig} />
      </div>

      <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Card
            className={
              "relative col-span-2 w-full max-w-4xl mx-auto overflow-hidden border-2 border-dashed border-gray-300 rounded-2xl text-center"
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
                  <p className="text-zinc-700 font-semibold">
                    {formatPrice(configuration.price!)}
                  </p>
                </div>

                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-zinc-700">Envío</p>
                  <p className="text-zinc-700 font-semibold">Gratis</p>
                </div>

                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-zinc-700">Total</p>
                  <p className="text-zinc-700 font-semibold">
                    {formatPrice(configuration.price!)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
