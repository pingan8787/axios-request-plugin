const requestInterceptors = {
    fulfilled(config){
        return config;
    },
    rejected(error){
        return Promise.reject(error);
    }
}

const responseInterceptors = {
    fulfilled(response){
        return response.data || response;
    },
    rejected(error){
        return Promise.reject(error);
    }
}

const CacheRequestInterceptor = {
    request: requestInterceptors,
    response: responseInterceptors
}

export default CacheRequestInterceptor;