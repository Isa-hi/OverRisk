"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClotheCustomizer from "./ClotheCustomizer";
import { Radio, RadioGroup } from "@headlessui/react";
import { useRef, useState } from "react";
import { COLORS, MODELS, SIZES } from "@/app/validators/option-validator";
import { Label } from "@/components/ui/label";
import { cn, formatPrice } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { SaveConfigProps, saveConfigToDB } from "./actions";
import { useRouter } from "next/navigation";
import { ClotheModel, ClotheSize } from "@prisma/client";

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
  const {toast} = useToast();
  const router = useRouter();

  const { mutate : saveConfigMutation } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args : SaveConfigProps) => {
      console.log(args);
      
      await Promise.allSettled([saveConfig(), saveConfigToDB(args)])
    },
    onError: () => {
      toast({
        title: 'Algo salió mal',
        description: 'No se pudo guardar la configuración. Por favor, intenta de nuevo.',
        variant: 'destructive'
      })},
    onSuccess: () => {
      toast({
        title: 'Configuración guardada',
        description: 'La configuración se guardó correctamente.'
      })
      router.push(`/configure/preview?id=${configId}`)
    }
  })

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    size: (typeof SIZES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    size: SIZES.options[0],
  });
  const [mockupUrl, setMockupUrl] = useState(options.color.imgMockup);
  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });
  const [renderedPosition, setRenderedPosition] = useState({
    x: 105,
    y: 200,
  });

  const clotheRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing('imageUploader')

  async function saveConfig() {
    try {
      toggleHandles(false); // Hide handles and border
      const {left: clotheLeft, top: clotheTop} = clotheRef.current!.getBoundingClientRect();
      const {left: containerLeft, top: containerTop, width: containerWidth, height: containerHeight} = containerRef.current!.getBoundingClientRect();

      const leftOffset = clotheLeft - containerLeft;
      const topOffset = clotheTop - containerTop;

      const actualX = renderedPosition.x + leftOffset;
      const actualY = renderedPosition.y + topOffset;

      const canvas = document.createElement('canvas');
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      const ctx = canvas.getContext('2d')!;

      const containerImage = new Image();
      containerImage.crossOrigin = 'anonymous';
      containerImage.src = mockupUrl;
      await new Promise((resolve) => containerImage.onload = resolve);
      ctx.drawImage(containerImage, 0, 0, containerWidth, containerHeight);

      const userImage = new Image();
      userImage.crossOrigin = 'anonymous';
      userImage.src = imageUrl;
      await new Promise((resolve) => userImage.onload = resolve);
      ctx.drawImage(userImage, actualX, actualY, renderedDimension.width, renderedDimension.height);

      const base64 = canvas.toDataURL(); // String
      const base64Data = base64.split(',')[1]; // Remove 44844fgyh4er848tghr84h8

      const blob = base64ToBlob(base64Data, 'image/png'); // Ahora sí es binario
      const file = new File([blob], "filename.png", {type: 'image/png'}); // Archivo real

      await startUpload([file], {configId});
    } catch (error) {
      toast({
        title: 'Algo salió mal',
        description: 'No se pudo guardar la configuración. Por favor, intenta de nuevo.',
        variant: 'destructive'
      })
    } finally {
      toggleHandles(true); // Show handles and border
    }
  }

  function toggleHandles(show: boolean) {
    const handles = clotheRef.current!.querySelectorAll('.handle-component');
    handles.forEach(handle => {
      (handle as HTMLElement).style.display = show ? 'block' : 'none';
    });
    (clotheRef.current as HTMLElement).style.border = show ? '3px solid var(--primary)' : 'none';
  }

  function base64ToBlob(base64: string, type: string) { // Function to convert a base64 image to a png
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length); 
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i); 
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <ClotheCustomizer
        imgUrl={imageUrl}
        imageDimensions={imageDimensions}
        mockupUrl={mockupUrl}
        setRenderedDimension={setRenderedDimension}
        setRenderedPosition={setRenderedPosition}
        clotheRef={clotheRef}
        containerRef={containerRef}
      />

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 ml-4 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div className="px-8 py-4">
            <h2 className="tracking-tight font-bold text-3xl">
              Personaliza tu prenda
            </h2>
          </div>
          <div className="w-full h-px bg-zinc-200 my-6" />

          <div className="relative mt-4 h-full flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <RadioGroup
                value={options.color}
                onChange={(val) => {
                  setOptions((prev) => ({ ...prev, color: val }));
                }}
              >
                <Label>Color: {options.color.label}</Label>
                <div className="mt-3 flex items-center space-x-3">
                  {COLORS.map((color) => (
                    <Radio
                      key={color.label}
                      value={color}
                      className={({ checked }) =>
                        cn(
                          "relative flex cursor-pointer justify-center items-center rounded-full p-0.5",
                          "active:ring-0 focus:ring-0 active:outline-none",
                          "border-2 border-transparent",
                          checked ? `border-black` : ""
                        )
                      }
                      onClick={() => setMockupUrl(color.imgMockup)}
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

              <div className="relative flex flex-col gap-3 w-full">
                <Label>Prenda:</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {options.model.label}
                      <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {MODELS.options.map((model) => (
                      <DropdownMenuItem
                        key={model.value}
                        className={cn(
                          "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                          {
                            "bg-zinc-100": model.label === options.model.label,
                          }
                        )}
                        onClick={() =>
                          setOptions((prev) => ({ ...prev, model }))
                        }
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 size-4",
                            model.label === options.model.label
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {model.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <RadioGroup>
                <Label>Talla:</Label>
                <div className="mt-3 flex items-center space-x-3">
                  {SIZES.options.map((size) => (
                    <Radio
                      key={size.label}
                      value={size}
                      className={({ checked }) =>
                        cn(
                          "relative flex cursor-pointer justify-center items-center rounded-sm p-0.5",
                          "active:ring-0 focus:ring-0 active:outline-none",
                          "border-2 border-transparent",
                          checked ? `border-orange-400 bg-orange-200` : ""
                        )
                      }
                      onClick={() => setOptions((prev) => ({ ...prev, size }))}
                    >
                      <Button variant="outline" className={"size-8 p-5"}>
                        {size.label}{" "}
                      </Button>
                    </Radio>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="size-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
                <p className="font-medium whitespace-nowrap">
                Total: {formatPrice(options.size.price + options.model.price)}
                </p>
              <Button size={'sm'} className="w-full" onClick={ () => saveConfigMutation({configId, 
                clotheColor: options.color.value, 
                clotheSize: options.size.value as ClotheSize, 
                clotheModel: options.model.value as ClotheModel,
                price: options.size.price + options.model.price
              })}>Continuar <ArrowRight className="size-4 ml-1.5 inline" /></Button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
