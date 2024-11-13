"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { changeOrderStatus } from "./actions";
import { useRouter } from "next/navigation";

const orderStatusesTranslations: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "Esperando envío",
  shipped: "Enviado",
  fulfilled: "Entregado",
};

type StatusDropdownProps = {
  id: string;
  orderStatus: OrderStatus;
};
export default function StatusDropdown({
  id,
  orderStatus,
}: StatusDropdownProps) {
    const router = useRouter();

    const { mutate } = useMutation({
        mutationKey: ["change-order-status"],
        mutationFn: changeOrderStatus,
        onSuccess: () => {
            router.refresh();
        }
    })

    const handleChangeStatus = (newStatus: OrderStatus) => {
        mutate({id, newStatus});
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-52 flex justify-center">
          {orderStatusesTranslations[orderStatus]}
          <ChevronsUpDownIcon className="ml-2 size-5 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.keys(orderStatusesTranslations).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleChangeStatus(status as OrderStatus)}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100 pr-5"
            , {
                "bg-zinc-100": orderStatus === status,
            })}
          >
            <CheckIcon className={cn("mr-2 size-5 text-primary", orderStatus === status ? "opacity-100" : "opacity-0")} />
            {orderStatusesTranslations[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
