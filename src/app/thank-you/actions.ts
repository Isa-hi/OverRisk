"use server"

import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

type getPaymentStatusArgs = {
    orderId: string
}
export async function getPaymentStatus({orderId} : getPaymentStatusArgs) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();   

    if(!user.id || !user.email) {
        throw new Error("Necesitas iniciar sesión para ver esta página");
    }

    const order = await prisma.order.findFirst({
        where: {
            id: orderId, userId: user.id
        },
        include: {
            billingAddress: true,
            config: true,
            shippingAddress: true,
            user: true
        }
    })    

    if(!order) {
        throw new Error("No se encontró la orden")
    }

    if(order.isPaid) {
        return order
    } else {
        return false
    }
}