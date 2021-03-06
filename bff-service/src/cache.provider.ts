import { Injectable } from "@nestjs/common";

interface CacheValue {
    timestamp: number;
    value: any;
    headers: any
}

const DEFAULT_TIMEOUT = 120;

@Injectable()
export default class CacheProvider {
    private timeout: number;
    private cache: Map<string, CacheValue>;
    constructor() {
        this.timeout = DEFAULT_TIMEOUT;
        this.cache = new Map<string, CacheValue>();
    }

    setValue = (path: string, value: any, headers) => {
        this.cache.set(path, {
            timestamp: new Date().getTime(),
            value,
            headers
        });
    };

    getValue = (path: string): any => {
        const cacheValue = this.cache.get(path);
        if (!cacheValue) {
            return undefined;
        }
        if (new Date().getTime() - cacheValue.timestamp < this.timeout * 1000) {
            return { headers: cacheValue.headers, value: cacheValue.value };
        } else return undefined;
    };
}
