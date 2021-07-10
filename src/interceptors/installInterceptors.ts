import { AxiosStatic } from 'axios';
import { Interceptor } from '../interface/interceptors';
import cancelRequestInterceptor from './cancelRequest';
import handleRequestInterceptor from './handlerRequest';

const defaultInterceptors: Interceptor[] = [
    handleRequestInterceptor,
    cancelRequestInterceptor
]

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
}

// 手动装载拦截器列表
export const installInterceptors = (axios: AxiosStatic, interceptors:Interceptor[]): AxiosStatic => {
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
}

// 自动装载所有拦截器
export const bootstrapInstallInterceptors = (axios: AxiosStatic): AxiosStatic => {
    if(!axios) return;
    return installInterceptors(axios, defaultInterceptors);
}