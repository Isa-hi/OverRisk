"use server"

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

type changeOrderStatusProps = {
    id: string;
    newStatus: OrderStatus;
}
export async function changeOrderStatus({id, newStatus}: changeOrderStatusProps) {
    await prisma.order.update({
        where: {
            id
        },
        data: {
            status: newStatus
        }
    })
}