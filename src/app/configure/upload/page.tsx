"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useState, useTransition } from "react";
import Dropzone from "react-dropzone";

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const isUploading = false;
  const [isPending, setIsPending] = useTransition();
  const [uploadProgress, setUploadProgress] = useState(45);

  const onDropAccepted = () => {
    console.log("Archivo aceptado");
  };
  const onDropRejected = () => {
    console.log("Archivo rechazado");
  };

  return (
    <>
      <div
        className={cn(
          "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center hover:cursor-pointer",
          {
            "ring-green-900/25 bg-green-900/10": isDragOver,
          }
        )}
      >
        <div className="relative flex flex-1 flex-col items-center justify-center w-full">
          <Dropzone
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
            onDropAccepted={onDropAccepted}
            onDropRejected={onDropRejected}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg"],
              "image/jpg": [".jpg"],
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className="size-full flex-1 flex flex-col items-center justify-center"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <p className="text-center text-gray-400 text-lg">
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="text-center text-gray-400 text-sm">
                  o haz clic aquí para seleccionar un archivo
                </p>
                {isDragOver ? (
                  <MousePointerSquareDashed className="size-16 text-green-600 mt-6" />
                ) : isUploading || isPending ? (
                  <Loader2 className="animate-spin size-10 text-zinc-500 mt-6" />
                ) : (
                  <ImageIcon className="size-16 text-zinc-500 mt-6" />
                )}

                <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                        <p>Subiendo tu imagen...</p>
                        <Progress value={uploadProgress} className="mt-2 w-40 h-2 bg-gray-300" />
                    </div>
                  ) : isPending ? (
                    <div className="flex flex-col items-center">
                        <p>Redirigiendo, por favor espera... </p>
                    </div>
                  ) : isDragOver && (
                    <p>
                        <span className="font-semibold">Suelta tu archivo</span> para subirlo
                    </p>
                  )}
                </div>

                { !isPending && (
                  <p className="text-xs text-zinc-500">
                    Formatos soportados: PNG, JPEG, JPG
                  </p>
                )}


              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </>
  );
}
