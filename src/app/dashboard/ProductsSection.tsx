"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createProduct, getProducts } from "./actions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { productFormSchema, productFormType } from "@/schema";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import Dropzone, { FileRejection } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Loader2, MousePointerSquareDashed } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgURL, setImgURL] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const currentProducts = await getProducts();
      setProducts(currentProducts);
    };
    fetchProducts();
  }, []);

  const { handleSubmit, control } = useForm<productFormType>();

  const onSubmit = (data: z.infer<typeof productFormSchema>) => {
    const parsedData = productFormSchema.safeParse({
      ...data,
      stock: Number(data.stock),
      price: Number(data.price),
      image: imgURL,
    });
    if(!parsedData.success) {
      toast({
        title: "Error al guardar el producto",
        description: "Por favor, revisa los campos",
        variant: "destructive",
      })
    }
    if(parsedData.data){
      createProduct(parsedData.data);
    }
  };

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const productId = data.serverData.configId;
      const imgURL = data.url;
      setImgURL(imgURL);
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles, { configId: undefined });
    setIsDragOver(false);
  };
  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;
    setIsDragOver(false);

    toast({
      title: `${file.file.name} no es un archivo válido`,
      description: "Por favor, sube un archivo PNG, JPEG o JPG",
      variant: "destructive",
    });
  };

  return (
    <MaxWidthWrapper>
      <Dialog>
        <DialogTitle className="hidden">Agregar producto</DialogTitle>
        <DialogTrigger asChild>
          <Button className="mb-2">Agregar producto</Button>
        </DialogTrigger>
        <DialogContent className="absolute z-[9999]">
          <h3 className="text-2xl font-bold my-4 text-orange-500 ">
            Agregar un producto
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              name="productName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <label>Nombre del producto</label>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <label>Descripción del producto</label>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              name="stock"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <label>Stock</label>
                  <Input type="number" {...field} />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <label>Precio</label>
                  <Input type="number" {...field} />
                </FormItem>
              )}
            />
            <FormField
              name="image"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <label>Imagen</label>
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
                        className="size-full flex-1 flex flex-col items-center justify-center bg-zinc-100 py-4 rounded-xl"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()}/>
                        {!imgURL && (
                          <>
                            <p className="text-center text-gray-400 text-lg">
                              Arrastra y suelta tu archivo aquí
                            </p>
                            <p className="text-center text-gray-400 text-sm">
                              o haz clic aquí para seleccionar un archivo
                            </p>
                            {isDragOver ? (
                              <MousePointerSquareDashed className="size-16 text-green-600 mt-6" />
                            ) : isUploading ? (
                              <Loader2 className="animate-spin size-10 text-zinc-500 mt-6" />
                            ) : (
                              <ImageIcon className="size-16 text-zinc-500 mt-6" />
                            )}
                          </>
                        )}

                        <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                          {isUploading ? (
                            <div className="flex flex-col items-center">
                              <p>Subiendo tu imagen...</p>
                              <Progress
                                value={uploadProgress}
                                className="mt-2 w-40 h-2 bg-gray-300"
                              />
                            </div>
                          ) : !isUploading && uploadProgress > 1 ? (
                            <div className="flex flex-col text-xl font-bold items-center">
                              <img className="max-h-40" src={imgURL} />
                            </div>
                          ) : (
                            isDragOver && (
                              <p>
                                <span className="font-semibold">
                                  Suelta tu archivo
                                </span>{" "}
                                para subirlo
                              </p>
                            )
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">
                          Formatos soportados: PNG, JPEG, JPG
                        </p>
                      </div>
                    )}
                  </Dropzone>
                </FormItem>
              )}
            />
            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>

          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>1</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <Button>Editar</Button>
                <Button>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableHeader>
      </Table>
    </MaxWidthWrapper>
  );
}
