import {Product} from "@libs/productSchema";
import data from './productList.json';
import {ProductServiceError} from "@functions/errors";
const products: Product[] = data;

export const getProductById:(productId: string) => Promise<Product | undefined> = async (productId: string) => {
    const product = products.find((product) => product.id === productId);

    if(!product) {
        throw new ProductServiceError(400, "There's no book with such id");
    }

    return product;
}

export const getProducts: () => Promise<Product[]> = async () => {
    return products ?? [];
}
