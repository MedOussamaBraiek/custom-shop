"use server"

import { db } from "@/db"
import { CaseColor, CaseFinish,CaseMaterial, ShirtSize, Product } from "@prisma/client"


export type SaveConfigArgs = {
    color: CaseColor,
    finish: CaseFinish,
    material: CaseMaterial,
    size: ShirtSize,
    product: Product,
    configId: string
}

export async function saveConfig({
    color,
    finish, 
    material, 
    size, 
    product,
    configId
}: SaveConfigArgs){
    await db.configuration.update({
        where: { id: configId },
        data: {product, color, size, finish, material}
    })
}