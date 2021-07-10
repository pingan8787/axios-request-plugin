import { installInterceptors, bootstrapInstallInterceptors } from './interceptors/installInterceptors';
import cancelRequestInterceptor from './interceptors/cancelRequest';

import { cacheRequestAdapter } from './adapters/cacheRequestAdapter';

export default {
    interceptors: {
        cancelRequestInterceptor
    },
    adapters: {
        cacheRequestAdapter
    },
    install:{
        installInterceptors,
        bootstrapInstallInterceptors
    }
}
