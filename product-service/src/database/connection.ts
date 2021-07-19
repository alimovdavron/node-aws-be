import {Pool, PoolClient} from 'pg';
import * as dotenv from 'dotenv';
import * as sqlQueries from './sql';

// @ts-ignore
dotenv.config( { silent: true });

const {
    PG_USER: user,
    PG_HOST: host,
    PG_DATABASE: database,
    PG_PASSWORD: password,
    PG_PORT: port
} = process.env

const databaseOptions = {
    user,
    host,
    database,
    password,
    port: Number(port)
}

// cached pool
let pool: Pool;

export const PossibleQueries = {
    SELECT_ALL_PRODUCTS: 0,
    SELECT_PRODUCT_BY_ID: 1,
    INSERT_PRODUCT: 2,
    INSERT_STOCK: 3
} as const;

const queryOptionMap = {
    [PossibleQueries.SELECT_ALL_PRODUCTS]: {
        SQL: sqlQueries.getProducts
    },
    [PossibleQueries.SELECT_PRODUCT_BY_ID]: {
        SQL: sqlQueries.getProductById
    },
    [PossibleQueries.INSERT_PRODUCT]: {
        SQL: sqlQueries.insertProduct
    },
    [PossibleQueries.INSERT_STOCK]: {
        SQL: sqlQueries.insertStock
    }
}

type Keys = keyof typeof PossibleQueries;
export type PossibleQueries = typeof PossibleQueries[Keys];

const initPool = () => {
    if (!pool) {
        pool = new Pool(databaseOptions);
    }

    return pool;
}

const _requestSingle = (connection: PoolClient | undefined) => async <T> (query: PossibleQueries, params): Promise<T | null> => {

    const result = await _requestArray(connection)<T>(query, params);

    if(result.length === 0) {
        return null;
    }

    return result[0];
}

const _requestArray = (connection: PoolClient | undefined) => async <T> (query: PossibleQueries, params): Promise<T[]> => {
    const { SQL } = queryOptionMap[query];

    if(connection) {
        const result = await connection.query<T>(SQL, params);
        return result.rows;
    }
    else {
        const initializedPool = initPool();
        const client = await initializedPool.connect();
        try {
            const result = await client.query<T>(SQL, params);
            return result.rows;
        }
        catch (e) {
            throw e;
        }
        finally {
            client.release();
        }
    }
}

export const requestArray = _requestArray(undefined);
export const requestSingle = _requestSingle(undefined);

interface Connection {
    requestArray: typeof requestArray,
    requestSingle: typeof requestSingle
}

export const transaction = async <T>(callback: (connection: Connection) => Promise<T>) => {
    const initializedPool = initPool();
    const client = await initializedPool.connect();

    let value = undefined;

    try {
        await client.query('BEGIN')
        try {
            value = await callback({
                requestArray: _requestArray(client),
                requestSingle: _requestSingle(client)
            })
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e;
        }
    } finally {
        client.release()
    }

    return value;
}
