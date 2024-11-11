"use client";

import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import Image from "next/image";
import { Configuration } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
        
      </div>
    </>
  );
}
