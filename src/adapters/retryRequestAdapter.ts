import { generateReqKey, isCacheLike } from '../utils/index';
import { MemoryCache } from '../utils/memoryCache';

/*
    重试请求适配器增强
    
    adapter：预增强的 Axios 适配器对象；
    options：缓存配置对象，该对象支持 4 个属性，分别用于配置不同的功能：
    options.times：全局设置请求重试的次数；
    options.delay：全局设置请求延迟的时间，单位是 ms。
*/
export const retryRequestAdapter = (adapter, options) => {
    const { times = 0, delay = 300 } = options;

    return config => {
        const { retryTimes = times, retryDelay = delay } = config;
        let __retryCount = 0;
        const request = async () => {
            try {
                return await adapter(config);
            } catch (error) {
                // 1. 判断是否进行重试
                if (!retryTimes || __retryCount >= retryTimes) {
                    return Promise.reject(error);
                }
                __retryCount++; // 增加重试次数

                // 2. 延时处理
                const delay = new Promise<void>(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, retryDelay)
                })

                // 3. 重新发送请求
                return delay.then(() => {
                    return request();
                })
            }
        }

        return request();
    }
}