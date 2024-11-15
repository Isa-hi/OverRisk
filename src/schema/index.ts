"use client"

import { z } from "zod";

export const productFormSchema = z.object({
    productName: z.string(),
    price: z.number(),
    description: z.string(),
    stock: z.number(),
    image: z.string(),
});
export type productFormType = z.infer<typeof productFormSchema>;

