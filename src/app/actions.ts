"use server"

import { prisma } from "@/lib/prisma";
import { productFormType } from "@/schema";
import { OrderStatus, Product } from "@prisma/client";

type changeOrderStatusProps = {
    id: string;
    newStatus: OrderStatus;
}
export async function changeOrderStatus({id, newStatus}: changeOrderStatusProps) {
    await prisma.order.update({
        where: {
            id
        },
        data: {
            status: newStatus
        }
    })
}

export async function getProducts() {
    return await prisma.product.findMany();
}

export async function createProduct({name, description, price, stock, image} : productFormType) {
    await prisma.product.create({
        data: {
            name,
            description,
            stock,
            price,
            image
        }
    })
}

export async function deleteProduct(id : Product['id']) {
    await prisma.product.delete({
        where: {
            id
        }
    })
}

export async function editProduct(id: Product['id'], {name, description, price, stock, image} : productFormType) {
    await prisma.product.update({
        where: {
            id
        },
        data: {
            name,
            description,
            stock,
            price,
            image
        }
    })
}

export async function getProductById(id: Product['id']) {
    return await prisma.product.findUnique({
        where: {
            id
        }
    })
}