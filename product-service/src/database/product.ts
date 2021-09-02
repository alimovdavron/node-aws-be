import { Product } from "../modelSchemas/product"
import { Stock } from "../modelSchemas/stock"
import { ProductServiceError } from "libs/src/errors";
import { PossibleQueries, requestArray, requestSingle, transaction } from './connection';

export type ProductResponse = Product & Pick<Stock, "count">

export const getProductById:(productId: string) => Promise<ProductResponse> = async (productId: string) => {
    const product = await requestSingle<ProductResponse>(PossibleQueries.SELECT_PRODUCT_BY_ID, [productId]);

    if(!product) {
        throw new ProductServiceError(404, "There's no book with such id");
    }

    return product;
}

export const getProducts: () => Promise<ProductResponse[]> = async () => {
    return requestArray<ProductResponse>(PossibleQueries.SELECT_ALL_PRODUCTS, undefined);
}

interface ProductToInsert {
    title: string,
    description?: string,
    price?: number,
    img_url?: string,
    count?: number
}

export const insertProduct: (productToInsert: ProductToInsert) => Promise<ProductResponse> = async ( {
        title,
        description,
        price,
        img_url,
    count
    }) => {

    const insertedProduct = await transaction(async connection => {
        const product = await connection.requestSingle<Product>(PossibleQueries.INSERT_PRODUCT, [title, description, price, img_url]);
        await connection.requestSingle<Stock>(PossibleQueries.INSERT_STOCK, [product.id, count]);
        const result = await connection.requestSingle<ProductResponse>(PossibleQueries.SELECT_PRODUCT_BY_ID, [product.id]);
        return result;
    })

    return insertedProduct;
}
