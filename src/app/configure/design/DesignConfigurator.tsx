"use client"
import { ScrollArea } from "@/components/ui/scroll-area";
import ClotheCustomizer from "./ClotheCustomizer";
import { Radio, RadioGroup } from "@headlessui/react"
import { useState } from "react";
import { COLORS } from "@/app/validators/option-validator";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type DesignConfiguratorProps = {
  configId: string;
  imageUrl: string;
  imageDimensions: {
    width: number;
    height: number;
  };
};
export default function DesignConfigurator({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) {

  const [options, setOptions] = useState<{color: (typeof COLORS)[number]}>({
    color: COLORS[0]

  })

  return (
    <div className="relative mt-20 grid grid-cols-3 mb-20 pb-20">
        <ClotheCustomizer className="col-span-2" imgUrl={imageUrl} imageDimensions={imageDimensions} />
        
        <div className="h-[37.5rem] flex flex-col bg-white ">
            <ScrollArea className="relative flex-1 overflow-auto">
              <div
                aria-hidden="true"
                className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
              />
              <div className="px-8 pb-12 pt-8">
                <h2 className="tracking-tight font-bold text-3xl">Personaliza tu prenda</h2>
              </div>
              <div className="w-full h-px bg-zinc-200 my-6" />

              <div className="relative mt-4 h-full flex flex-col justify-between">
                <RadioGroup value={options.color} onChange={(val) => {
                  setOptions((prev) => ({...prev, color: val}))
                }}>
                  <Label>
                    Color: {options.color.label}
                  </Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                        <Radio 
                        key={color.label} 
                        value={color} 
                        className={({checked}) => cn(
                          "relative flex cursor-pointer justify-center items-center rounded-full p-0.5",
                          "active:ring-0 focus:ring-0 active:outline-none",
                          "border-2 border-transparent",
                          checked ? `border-black` : ''
                        )}
                      > 
                        <span 
                          className={cn(
                            "size-8 rounded-full border border-black border-opacity-10 inline-block"
                          )}
                          style={{ backgroundColor: color.value }}
                        /> 
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
            </ScrollArea>
          </div>
    </div>
  )
}
