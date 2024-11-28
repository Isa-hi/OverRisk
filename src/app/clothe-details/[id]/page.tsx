"use client";
import { useParams } from "next/navigation";
import ImageGallery from "../components/image-gallery";
import ProductDetails from "../components/product-details";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/app/actions";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

export default function ClothingDetailPage() {
  const { id } = useParams();
  const productId = parseInt(Array.isArray(id) ? id[0] : id);

  const { data: item, isLoading } = useQuery({
    queryKey: ["clothing-item", id],
    queryFn: async () => await getProductById(productId),
  });

  if (isLoading) return <p>Loading...</p>;

  if (item)
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-primary flex">
          <ChevronLeftIcon className="w-6 h-6" />
          Volver a la tienda
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageGallery item={item} />
          <ProductDetails item={item} />
        </div>
      </div>
    );
}
