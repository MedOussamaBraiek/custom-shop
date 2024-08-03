"use server"

import { db } from "@/db"
import { CaseColor, CaseFinish,CaseMaterial, ShirtSize } from "@prisma/client"


export type SaveConfigArgs = {
    color: CaseColor,
    finish: CaseFinish,
    material: CaseMaterial,
    size: ShirtSize,
    configId: string
}

export async function saveConfig({
    color,
    finish, 
    material, 
    size, 
    configId
}: SaveConfigArgs){
    await db.configuration.update({
        where: { id: configId },
        data: {color, size, finish, material}
    })
}