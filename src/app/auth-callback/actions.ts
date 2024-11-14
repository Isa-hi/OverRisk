"use server"

import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const getAuthStatus = async () => {
    // Add CORS headers
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type");

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if(!user?.id || !user.email) {
        throw new Error("No se pudo obtener la información del usuario")
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    })

    if(!existingUser) {
        await prisma.user.create({
            data: {
                id: user.id,
                email: user.email
            }
        })
    }

    return { success: true, headers }

}