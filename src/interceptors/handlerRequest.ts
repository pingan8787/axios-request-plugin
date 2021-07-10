import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { Interceptor } from '../interface/interceptors';

const requestInterceptors = {
    fulfilled(config: AxiosRequestConfig): AxiosRequestConfig{
        return config;
    },
    rejected(error: AxiosError){
        return Promise.reject(error);
    }
}

const responseInterceptors = {
    fulfilled(response: AxiosResponse): AxiosResponse{
        return response.data || response;
    },
    rejected(error: AxiosError){
        return Promise.reject(error);
    }
}

const handleRequestInterceptor: Interceptor = {
    request: requestInterceptors,
    response: responseInterceptors
}

export default handleRequestInterceptor;