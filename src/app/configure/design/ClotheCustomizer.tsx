import Image from "next/image";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Rnd } from "react-rnd";
import HandleComponent from "@/components/HandleComponent";

interface TShirtCustomizerProps {
  imgUrl: string;
  imageDimensions: { height: number; width: number };
  className?: string;
}

export default function Component({
  className,
  imgUrl,
  imageDimensions,
}: TShirtCustomizerProps) {
  return (
    <Card
      className={cn(
        "relative w-full max-w-4xl mx-auto overflow-hidden",
        className
      )}
    >
      <div className="relative w-full max-w-2xl mx-auto">
        <AspectRatio ratio={1282 / 1515} className="w-full">
          {/* Container for the t-shirt mockup */}
          <div className="relative w-full h-full">
            <Image
              fill
              src="/mockups/black-tshirt-mockup.png"
              alt="T-shirt mockup"
              className="object-contain pointer-events-none select-none"
              priority
            />

            {/* Printable area overlay - using percentage-based positioning */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative left-1 w-[50%] h-[70%]">
                {/* Semi-transparent mask around printable area */}
                <div className="absolute inset-0 shadow-[0_0_0_9999px_rgba(229,231,235,0.6)] rounded-2xl" />
              </div>
            </div>

            <Rnd
              default={{
                x: 150,
                y: 200,
                height: imageDimensions.height / 4,
                width: imageDimensions.width / 4,
              }}
              lockAspectRatio
              resizeHandleComponent={{
                bottomRight: <HandleComponent />,
                bottomLeft: <HandleComponent />,
                topRight: <HandleComponent />,
                topLeft: <HandleComponent />,
              }}
              className="absolute z-20 border-[3px] border-primary"
              bounds="parent"
            >
              <div className="relative size-full">
                <Image
                  fill
                  src={imgUrl}
                  alt="Your_image"
                  className="pointer-events-none"
                />
              </div>
            </Rnd>
          </div>
        </AspectRatio>
      </div>
    </Card>
  );
}
