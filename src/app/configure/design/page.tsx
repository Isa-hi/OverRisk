import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>
}

export default async function page({ searchParams }: PageProps) {
  const { id } =  await searchParams;
  if (!id || typeof id !== 'string') {
    return notFound();
  }

  const configuration = await prisma.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  const { imageUrl, width, height } = configuration;

  return (
    <DesignConfigurator configId={configuration.id} imageUrl={imageUrl} imageDimensions={{ width, height }} />
  );
}
