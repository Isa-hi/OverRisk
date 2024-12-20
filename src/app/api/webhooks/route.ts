import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend"
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headersList = await headers(); // Await the headers function
        const signature = headersList.get("stripe-signature");
        if (!signature) {
            return new Response("Invalid request", { status: 400 });
        }
        const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        if (event.type === 'checkout.session.completed') {
            if (!event.data.object.customer_details?.email) {
                throw new Error("No email found");
            }

            const session = event.data.object as Stripe.Checkout.Session;

            const { userId, orderId } = session.metadata || { userId: null, orderId: null };
      
            if (!userId || !orderId) {
                throw new Error("No metadata found");
            }

            const billingAddress = session.customer_details!.address;
            const shippingAddress = session.shipping_details!.address;         

            const updatedOrder = await prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    isPaid: true,
                    shippingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: shippingAddress!.city!,
                            country: shippingAddress!.country!,
                            postalCode: shippingAddress!.postal_code!,
                            street: shippingAddress!.line1!,
                            state: shippingAddress!.state!
                        }
                    },
                    billingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: billingAddress!.city!,
                            country: billingAddress!.country!,
                            postalCode: billingAddress!.postal_code!,
                            street: billingAddress!.line1!,
                            state: billingAddress!.state!
                        }
                    }
                }
            });

            await resend.emails.send({
                from: `OverRisk <${process.env.RESEND_SENDER_EMAIL}>`,
                to: [event.data.object.customer_details.email], // Proabably should be the email from the user
                subject: "¡Gracias por tu compra en OverRisk!",
                react: OrderReceivedEmail({
                    orderId,
                    orderDate: updatedOrder.createdAt.toLocaleDateString(),
                    // @ts-expect-error - We already got the shipping address from stripe
                    shippingAddress: {
                        name: session.customer_details!.name!,
                        city: shippingAddress!.city!,
                        country: shippingAddress!.country!,
                        postalCode: shippingAddress!.postal_code!,
                        street: shippingAddress!.line1!,
                        state: shippingAddress!.state!
                    }

                })
            });
        }

        return NextResponse.json({ result: event, ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong", ok: false }, { status: 500 });
    }
}