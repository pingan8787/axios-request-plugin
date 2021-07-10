(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios')) :
    typeof define === 'function' && define.amd ? define(['axios'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.axiosRequestPlugin = factory(global.axios));
}(this, (function (axios) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

    // 用于根据当前请求的信息，生成请求 Key
    const generateReqKey = config => {
        const { method, url, params, data } = config;
        return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
    };

    const isCacheLike = cache => {
        return !!(cache.set && cache.get && cache.delete && cache.clear
            && typeof cache.get === 'function' && typeof cache.set === 'function'
            && typeof cache.delete === 'function' && typeof cache.clear === 'function'
        );
    };

    const pendingRequest = new Map();

    const addPendingRequest = config => {
        const requestKey = generateReqKey(config);
        // 用于把当前请求信息添加到pendingRequest对象中
        config.cancelToken = config.cancelToken || new axios__default['default'].CancelToken(cancel => {
            if(!pendingRequest.has(requestKey)){
                pendingRequest.set(requestKey, cancel);
            }
        });
    };

    const removePendingRequest = config => {
        const requestKey = generateReqKey(config);
        // 检查是否存在重复请求，若存在则取消已发的请求
        if(pendingRequest.has(requestKey)){
            const cancelToken = pendingRequest.get(requestKey);
            cancelToken(requestKey);
            pendingRequest.delete(requestKey);
        }
    };

    const requestInterceptors = {
        fulfilled(config){
            removePendingRequest(config);
            addPendingRequest(config);
            return config;
        },
        rejected(error){
            return Promise.reject(error);
        }
    };

    const responseInterceptors = {
        fulfilled(response){
            removePendingRequest(response.config);
            return response;
        },
        rejected(error){
            removePendingRequest(error.config || {});
            if (axios__default['default'].isCancel(error)) {
              console.log("已取消的重复请求：" + error.message);
            } else {
              console.log("异常情况");
            }
            return Promise.reject(error);
        }
    };

    const CancelRequestInterceptor = {
        request: requestInterceptors,
        response: responseInterceptors
    };

    const interceptors = [
        CancelRequestInterceptor,
        CancelRequestInterceptor
    ];

    const toArray = target => {
        const type = typeof target;
        let result = [];
        if (type === "object") {
          if (Array.isArray(target)) {
            result = target;
          } else {
            result.push(target);
          }
        }
        return result;
    };

    // 手动装载拦截器列表
    const installInterceptors = (axios, interceptors) => {
        if(!axios) return;
        interceptors = toArray(interceptors);
        if(interceptors && interceptors.length > 0){
            interceptors.forEach(interceptor => {
                const { request, response } = interceptor;
                axios.interceptors.request.use(request.fulfilled, request.rejected);
                axios.interceptors.response.use(response.fulfilled, response.rejected);
            });
        }
        return axios;
    };

    // 自动装载所有拦截器
    const bootstrapInstallInterceptors = (axios) => {
        if(!axios) return;
        return installInterceptors(axios, interceptors);
    };

    const MemoryCache = {
        data: {},
        get(key){
            const cacheItem = this.data[key];
            if(!cacheItem) return null;
            const isExpired = Date.now() - cacheItem.now > cacheItem.maxAge;
            isExpired && this.delete(key);
            return isExpired ? null : cacheItem.value;
        },
        set(key, value, maxAge = 0){
            this.data[key] = {
                maxAge,
                value,
                now: Date.now()
            };
        },
        delete(key){
            return delete this.data[key];
        },
        clear(){
            this.data = {};
        }
    };

    /*
    adapter：预增强的 Axios 适配器对象；
    options：缓存配置对象，该对象支持 4 个属性，分别用于配置不同的功能：
        maxAge：全局设置缓存的最大时间；
        enabledByDefault：是否启用缓存，默认为 true；
        cacheFlag：缓存标志，用于配置请求 config 对象上的缓存属性；
        defaultCache：用于设置使用的缓存对象。
    */
    const cacheAdapterEnhancer = (adapter, options) => {
        const { maxAge,
            enabledByDefault = true,
            cacheFlag = "cache",
            defaultCache = MemoryCache
        } = options;
        return config => {
            const { url, method = "", params, forceUpdate } = config;
            let useCache = config[cacheFlag] !== undefined & config[cacheFlag] !== null
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
    };

    var index = {
        interceptors: {
            CancelRequestInterceptor
        },
        adapters: {
            cacheAdapterEnhancer
        },
        install:{
            installInterceptors,
            bootstrapInstallInterceptors
        }
    };

    return index;

})));
