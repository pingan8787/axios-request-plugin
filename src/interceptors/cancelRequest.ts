import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { Interceptor } from '../interface/interceptors';
import { generateReqKey } from '../utils/index';

const pendingRequest = new Map();

const addPendingRequest = (config: AxiosRequestConfig) => {
    const requestKey = generateReqKey(config);
    // 用于把当前请求信息添加到pendingRequest对象中
    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
        if(!pendingRequest.has(requestKey)){
            pendingRequest.set(requestKey, cancel);
        }
    })
}

const removePendingRequest = (config: AxiosRequestConfig) => {
    const requestKey = generateReqKey(config);
    // 检查是否存在重复请求，若存在则取消已发的请求
    if(pendingRequest.has(requestKey)){
        const cancelToken = pendingRequest.get(requestKey);
        cancelToken(requestKey);
        pendingRequest.delete(requestKey);
    }
}

const requestInterceptors = {
    fulfilled(config: AxiosRequestConfig): AxiosRequestConfig{
        removePendingRequest(config);
        addPendingRequest(config);
        return config;
    },
    rejected(error: AxiosError){
        return Promise.reject(error);
    }
}

const responseInterceptors = {
    fulfilled(response: AxiosResponse): AxiosResponse{
        removePendingRequest(response.config);
        return response;
    },
    rejected(error: AxiosError){
        removePendingRequest(error.config || {});
        if (axios.isCancel(error)) {
          console.log("已取消的重复请求：" + error.message);
        } else {
          console.log("异常情况")
        }
        return Promise.reject(error);
    }
}

const cancelRequestInterceptor: Interceptor = {
    request: requestInterceptors,
    response: responseInterceptors
}

export default cancelRequestInterceptor;