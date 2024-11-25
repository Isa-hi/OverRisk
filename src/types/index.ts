export type ClothingItemCard = {
    name: string;
    id: number;
    price: number;
    image: string;
    description: string;
    stock: number;
    createdAt: Date;
    shoppingCartId: number | null;
}