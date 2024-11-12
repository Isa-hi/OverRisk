import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

type PageProps = {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }> 
}
export default async function page({searchParams} : PageProps) {
    const { id } = await searchParams;
    if(!id || typeof id !== 'string') {
        return notFound();
    }
    const configuration = await prisma.configuration.findUnique({
        where: {
            id: id
        }
    });
    if(!configuration) {
        return notFound();
    }


  return (
    <DesignPreview configuration={configuration} />
  )
}
