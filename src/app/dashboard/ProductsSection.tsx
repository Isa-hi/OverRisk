"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct, getProducts } from "./actions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { PencilLineIcon, Trash2Icon } from "lucide-react";
import AddProductForm from "./AddProductForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: productsQueryData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    retry: true,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (productsQueryData) {
      setProducts(productsQueryData);
    }
  }, [productsQueryData]);

  const { mutate: deleteProductMutation } = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: deleteProduct,
    onError: (error) => {
      toast({
        title: "Error al eliminar el producto",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Producto eliminado",
        description: "El producto fue eliminado correctamente",
        className: "border-green-500 border-2",
      });
    },
  });

  const handleDeleteProduct = (id: Product["id"]) => {
    deleteProductMutation(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <Dialog>
        <DialogTitle className="hidden">Agregar producto</DialogTitle>
        <DialogTrigger asChild>
          <Button className="mb-2">Agregar producto</Button>
        </DialogTrigger>
        <DialogContent className="absolute z-[9999]">
          <AddProductForm />
        </DialogContent>
      </Dialog>
      <Table className="mb-12">
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
              <TableCell className="gap-3 flex">
                <Button variant="outline">
                  <PencilLineIcon />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableHeader>
      </Table>
    </>
  );
}
