"use server"

import { prisma } from "@/lib/prisma"
import { ClotheColor, ClotheModel, ClotheSize } from "@prisma/client"

export type SaveConfigProps = {
    clotheColor: ClotheColor,
    clotheSize: ClotheSize,
    clotheModel: ClotheModel,
    configId: string,
    price: number
}
// RPC: Remote Procedure Call
export async function saveConfigToDB({clotheColor, clotheSize, clotheModel, configId, price} : SaveConfigProps) { 
    await prisma.configuration.update({
        where: {
            id: configId
        },
        data: {
            clotheColor,
            clotheSize,
            clotheModel,
            price
        }
    })
}