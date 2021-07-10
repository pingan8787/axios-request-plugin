import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface InterceptorManager<V> {
    fulfilled: (value: V) => V | Promise<V>;
    rejected: (error: any) => any;
}

export type RequestInterceptor = InterceptorManager<AxiosRequestConfig>;
export type ResponseInterceptor = InterceptorManager<AxiosResponse>;

export interface Interceptor {
    request?: RequestInterceptor;
    response?: ResponseInterceptor;
}