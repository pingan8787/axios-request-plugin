import { generateReqKey, isCacheLike } from '../utils/index';
import { MemoryCache } from '../utils/memoryCache';

/*
    请求缓存适配器
    
    adapter：预增强的 Axios 适配器对象；
    options：缓存配置对象，该对象支持 4 个属性，分别用于配置不同的功能：
    options.maxAge：全局设置缓存的最大时间；
    options.enabledByDefault：是否启用缓存，默认为 true；
    options.cacheFlag：缓存标志，用于配置请求 config 对象上的缓存属性；
    options.defaultCache：用于设置使用的缓存对象。
*/
export const cacheRequestAdapter = (adapter, options) => {
    const { maxAge,
        enabledByDefault = true,
        cacheFlag = "cache",
        defaultCache = MemoryCache
    } = options;
    return config => {
        const { url, method = "", params, forceUpdate } = config;
        let useCache = config[cacheFlag] !== undefined && config[cacheFlag] !== null
            ? config[cacheFlag]
            : enabledByDefault;

        // 处理 Get 请求，目前考虑到的是只有 Get 请求需要做数据缓存
        if (useCache && method.toLowerCase() === 'get') {
            const cache = isCacheLike(useCache) ? useCache : defaultCache;
            let requestKey = generateReqKey(config);
            let responsePromise = cache.get(requestKey);// 从缓存中获取请求key对应的响应对象
            if (!responsePromise || forceUpdate) {// 缓存未命中/失效或强制更新时，则重新请求数据
                responsePromise = (async () => {
                    try {
                        return await adapter(config);// 使用默认的 xhrAdapter 发送请求
                    } catch (reason) {
                        cache.delete(requestKey);
                        throw reason;
                    }
                })();
                cache.set(requestKey, responsePromise, maxAge); // 保存请求返回的响应对象
                return responsePromise; // 返回已保存的响应对象
            }
            return responsePromise;
        }
        return adapter(config); // 使用默认的xhrAdapter发送请求
    }
}