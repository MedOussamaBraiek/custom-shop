// bg-blue-950 border-blue-950
// bg-black border-black
// bg-white border-white
// bg-amber-100 border-amber-100

import { PRODUCT_PRICES } from "@/config/products"

export const COLORS = [
    {
        label: "Noir",
        value: "black",
        tw: "black"
    },
    {
        label: "Blanc",
        value: "white",
        tw: "white"
    },

    {
        label: "Beige",
        value: "beige",
        tw: "amber-100"
    },
    
] as const

export const SIZES = {
    name: 'sizes',
    options: [
        {
            label: "XS",
            value: "xs"
        },
        {
            label: "S",
            value: "s"
        },
        {
            label: "M",
            value: "m"
        },
        {
            label: "L",
            value: "l"
        },
        {
            label: "XL",
            value: "xl"
        },
    ]
} as const 

export const MATERIALS = {
    name: 'material',
    options: [
        {
            label: "Silicon",
            value: "silicon",
            description: undefined,
            price: PRODUCT_PRICES.material.silicone
        },
        {
            label: "Soft Polycarbonate",
            value: "polycarbonate",
            description: "Scratch-resistant coating",
            price: PRODUCT_PRICES.material.polycarbonate
        },
    ]
} as const

export const FINISHES = {
    name: 'finish',
    options: [
        {
            label: "Smouth  Finish",
            value: "smooth",
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth
        },
        {
            label: "Textured Finish",
            value: "textured",
            description: "Soft grippy texture",
            price: PRODUCT_PRICES.finish.textured
        },
    ]
} as const

export const PRODUCTS = {
    name: 'prducts',
    options: [
        {
            label: "Shirt",
            value: "shirt",
        },
        {
            label: "Cup",
            value: "cup",
        },
        {
            label: "Sac",
            value: "sac",
        },
    ]
} as const