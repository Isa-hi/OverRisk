"use server"

import { prisma } from "@/lib/prisma";
import { productFormType } from "@/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OrderStatus, Product } from "@prisma/client";

type changeOrderStatusProps = {
    id: string;
    newStatus: OrderStatus;
}

export async function getUser() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    return user
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

/* PRODUCTS ACTIONS */

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

/* SHOPPING CART ACTIONS */
export async function getUserShoppingCart(userId: string) {
    return await prisma.shoppingCart.findFirst({
        where: {
            userId
        },
        include: {
            products: true
        }
    })
}

export async function addProductToShoppingCart(userId: string, productId: Product['id']) {
    // Verif if there is a shopping cart for the user
    const shoppingCart = await prisma.shoppingCart.findFirst({
        where: {
          userId: userId,
        },
      });
      if(shoppingCart){
        // If there is a shopping cart, add the product to the shopping cart
        await prisma.shoppingCart.update({
          where: {
            id: shoppingCart.id,
          },
          data: {
            products: {
              connect: {
                id: productId,
              },
            },
          },
        });
      } else {
        // If there is no shopping cart, create a shopping cart and add the product to the shopping cart
        await prisma.shoppingCart.create({
          data: {
            userId: userId,
            products: {
              connect: {
                id: productId,
              },
            },
          },
        });
      }
}