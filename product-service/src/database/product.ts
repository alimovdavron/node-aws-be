import { Product } from "./productSchema";
import { ProductServiceError } from "@functions/errors";
import { PossibleQueries, requestArray, requestSingle, transaction } from './connection';

export const getProductById:(productId: string) => Promise<Product> = async (productId: string) => {
    const product = await requestSingle<Product>(PossibleQueries.SELECT_PRODUCT_BY_ID, [productId]);

    if(!product) {
        throw new ProductServiceError(404, "There's no book with such id");
    }

    return product;
}

export const getProducts: () => Promise<Product[]> = async () => {
    return requestArray<Product>(PossibleQueries.SELECT_ALL_PRODUCTS, undefined);
}

interface ProductToInsert {
    title: string,
    description?: string,
    price?: number,
    img_url?: string,
    count?: number
}

interface ProductDB {
    id: string,
    title: string,
    description: string | null,
    price: number | null,
    img_url: string | null,
}

interface StockDB {
    product_id: string,
    count: number | null
}

export const insertProduct: (productToInsert: ProductToInsert) => Promise<Product> = async ( {
        title,
        description,
        price,
        img_url,
    count
    }) => {

    const insertedProduct = await transaction(async connection => {
        const product = await connection.requestSingle<ProductDB>(PossibleQueries.INSERT_PRODUCT, [title, description, price, img_url]);
        await connection.requestSingle<StockDB>(PossibleQueries.INSERT_STOCK, [product.id, count]);
        const result = await connection.requestSingle<Product>(PossibleQueries.SELECT_PRODUCT_BY_ID, [product.id]);
        return result;
    })

    return insertedProduct;
}
