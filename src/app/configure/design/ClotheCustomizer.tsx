import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Rnd } from "react-rnd";
import HandleComponent from "@/components/HandleComponent";

interface TShirtCustomizerProps {
  imgUrl: string;
  imageDimensions: { height: number; width: number };
  mockupUrl: string;
  setRenderedDimension: (dimension: { width: number; height: number }) => void;
  setRenderedPosition: (position: { x: number; y: number }) => void;
  clotheRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function Component({
  imgUrl,
  imageDimensions,
  mockupUrl,
  setRenderedDimension,
  setRenderedPosition,
  clotheRef: tshirtRef,
  containerRef,
}: TShirtCustomizerProps) {
  return (
    <Card
      ref={containerRef}
      className={
        "relative col-span-2 w-full max-w-4xl mx-auto overflow-hidden border-2 border-dashed border-gray-300 rounded-2xl text-center"
      }
    >
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Container for the t-shirt mockup */}
        <div className="relative w-full h-full">
          <AspectRatio ref={tshirtRef} ratio={1282 / 1515} className="w-full">
            <Image
              fill
              src={mockupUrl}
              alt="T-shirt mockup"
              className="object-cover pointer-events-none select-none"
              priority
            />
          </AspectRatio>

          <Rnd
            default={{
              x: 150,
              y: 200,
              height: imageDimensions.height / 4,
              width: imageDimensions.width / 4,
            }}
            onResizeStop={(_, __, ref, ___, { x, y }) => {
              setRenderedDimension({
                width: +ref.style.width.slice(0, -2),
                height: +ref.style.height.slice(0, -2),
              });
              setRenderedPosition({ x, y });
            }}
            onDragStop={(_, data) => {
              const { x, y } = data;
              setRenderedPosition({ x, y });
            }}
            lockAspectRatio
            resizeHandleComponent={{
              bottomRight: <HandleComponent className="handle-component" />,
              bottomLeft: <HandleComponent className="handle-component" />,
              topRight: <HandleComponent className="handle-component" />,
              topLeft: <HandleComponent className="handle-component" />,
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
      </div>
    </Card>
  );
}
