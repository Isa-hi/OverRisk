"use server"

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { Order } from "@prisma/client"

export const createCheckoutSession = async (configurationId: string) => {
    const configuration = await prisma.configuration.findUnique({
        where: {
            id: configurationId
        }
    })
    if (!configuration) {
        throw new Error("Ninguna configuración encontrada")
    }

    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user) {
        throw new Error("Necesitas iniciar sesión para continuar")
    }
    const userId = user.id // Ensure user ID is correctly retrieved

    // Verify that the user ID exists in the database
    console.log("User ID", userId);
    
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!existingUser) {
        throw new Error("Usuario no encontrado en la base de datos")
    }

    const price  = configuration.price! * 100

    let order: Order | undefined = undefined

    console.log("User", user);
    

    const existingOrder = await prisma.order.findFirst({
        where: {
           userId: userId, 
           configId: configuration.id,
        }
    })

    if (existingOrder) {
        order = existingOrder
    } else {
        order = await prisma.order.create({
            data: {
                userId: userId,
                configId: configuration.id,
                amount: price,
            }
        })
    }

    const product = await stripe.products.create({
        name: "Configuración de diseño",
        images: [configuration.imageUrl],
        default_price_data: {
            currency: "mxn",
            unit_amount: price
        }
    })
    
    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
        payment_method_types: ["card"],
        mode: "payment",
        shipping_address_collection: {
            allowed_countries: ["MX"]
        },
        metadata: {
            userId: userId,
            orderId: order.id,
        },
        line_items: [{
            price: product.default_price as string,
            quantity: 1
        }]
    })

    return {url: stripeSession.url} // Return the URL to redirect the user to the checkout page
}