"use server"

import { db } from "@/db"
import { ProductColor, ShirtSize, productType } from "@prisma/client"


export type SaveConfigArgs = {
    color: ProductColor,
    size: ShirtSize,
    productType: productType,
    configId: string
}

export async function saveConfig({
    color,
    size, 
    productType,
    configId
}: SaveConfigArgs){
    await db.configuration.update({
        where: { id: configId },
        data: {productType, color, size}
    })
}