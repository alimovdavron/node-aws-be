import {Product} from "./productSchema";
import products from "./productList";
import {ProductServiceError} from "@functions/errors";

export const getProductById:(productId: string) => Promise<Product | undefined> = async (productId: string) => {
    const product = products().find((product) => product.id === productId);

    if(!product) {
        throw new ProductServiceError(404, "There's no book with such id");
    }

    return product;
}

export const getProducts: () => Promise<Product[]> = async () => {
    return products() ?? [];
}
