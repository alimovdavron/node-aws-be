import {Product} from "./productSchema";
import products from "./productList";
import {ProductServiceError} from "@functions/errors";
import connection from './connection';

export const getProductById:(productId: string) => Promise<Product | undefined> = async (productId: string) => {
    const product = products().find((product) => product.id === productId);

    if(!product) {
        throw new ProductServiceError(404, "There's no book with such id");
    }

    return product;
}

const getProductsQuery = `select id, title, description, price, img_url from product`;

export const getProducts: () => Promise<Product[]> = async () => {
    return connection.query(getProductsQuery, undefined);
}
