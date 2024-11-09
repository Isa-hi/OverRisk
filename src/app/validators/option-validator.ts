// bg-zinc-900 border-zinc-900

import { PRODUCT_PRICES } from "@/config/products"

// bg-white border-white
export const COLORS = [
    {
        label: "Negro",
        value: "black",
        tw: "zinc-900",
        imgMockup: "/mockups/black-tshirt-mockup.png"

    },
    {
        label: "Blanco",
        value: "white",
        tw: "white",
        imgMockup: "/mockups/white-tshirt-mockup.png"
    },
] as const

export const MODELS = {
    name: "models",
    options: [
        {
            label: "Playera",
            value: "playera",
            price: PRODUCT_PRICES.models.playera
        },
        {
            label: "Sudadera",
            value: "sudadera",
            price: PRODUCT_PRICES.models.sudadera
        }
    ]
} as const

export const SIZES = {
    name: "size",
    options: [{
        label: "LG",
        value: "lg",
        price: PRODUCT_PRICES.size.lg
    }, {
        label: "XL",
        value: "xl",
        price: PRODUCT_PRICES.size.xl
    }]
}