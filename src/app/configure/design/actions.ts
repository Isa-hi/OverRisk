"use server"

import { prisma } from "@/lib/prisma"
import { ClotheColor, ClotheModel, ClotheSize } from "@prisma/client"

export type SaveConfigProps = {
    clotheColor: ClotheColor,
    clotheSize: ClotheSize,
    clotheModel: ClotheModel,
    configId: string
}
// RPC: Remote Procedure Call
export async function saveConfigToDB({clotheColor, clotheSize, clotheModel, configId} : SaveConfigProps) { 
    await prisma.configuration.update({
        where: {
            id: configId
        },
        data: {
            clotheColor,
            clotheSize,
            clotheModel
        }
    })
}