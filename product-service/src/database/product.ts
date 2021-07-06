import {Product} from "./productSchema";
import {ProductServiceError} from "@functions/errors";
import { getProducts as getProductsQuery, getProductById as getProductByIdQuery } from './sql'
import connection from './connection';

export const getProductById:(productId: string) => Promise<Product | undefined> = async (productId: string) => {
    const product: Product | undefined = await connection.query(getProductByIdQuery, [productId]);
    // const product = products().find((product) => product.id === productId);

    if(!product) {
        throw new ProductServiceError(404, "There's no book with such id");
    }

    return product;
}

export const getProducts: () => Promise<Product[]> = async () => {
    return connection.query(getProductsQuery, undefined);
}
