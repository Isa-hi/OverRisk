"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAuthStatus } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [configId, setConfigId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const configurationId = localStorage.getItem("configurationId");
    if (configurationId) {
      setConfigId(configurationId);
    }
  }, []);

  const { data, error } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => await getAuthStatus(),
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching auth status:", error);
      router.push("/error");
      return;
    }
    if (data?.success && configId) {
      localStorage.removeItem("configurationId");
      router.push(`/configure/preview?id=${configId}`);
    } else {
      router.push("/");
    }
  }, [data, error]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="size-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Iniciando sesión...</h3>
        <p>Serás direccionado automaticamente</p>
      </div>
    </div>
  );
}
