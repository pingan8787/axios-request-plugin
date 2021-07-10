// 用于根据当前请求的信息，生成请求 Key
export const generateReqKey = config => {
    const { method, url, params, data } = config;
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
}

export const isCacheLike = cache => {
    return !!(cache.set && cache.get && cache.delete && cache.clear
        && typeof cache.get === 'function' && typeof cache.set === 'function'
        && typeof cache.delete === 'function' && typeof cache.clear === 'function'
    );
}