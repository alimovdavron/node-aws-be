interface CacheValue {
  timestamp: number;
  value: any;
}

export default class Cache {
  private timeout: number;
  private cache: Map<string, CacheValue>;
  constructor(timeout: number) {
    this.timeout = timeout;
    this.cache = new Map<string, CacheValue>();
  }

  setValue = (path: string, value: any) => {
    this.cache.set(path, {
      timestamp: new Date().getTime(),
      value,
    });
  };

  getValue = (path: string) => {
    const cacheValue = this.cache.get(path);
    if (!cacheValue) {
      return undefined;
    }
    if (new Date().getTime() - cacheValue.timestamp < this.timeout * 1000) {
      return cacheValue.value;
    } else return undefined;
  };
}
