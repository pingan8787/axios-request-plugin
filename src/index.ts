import { installInterceptors, bootstrapInstallInterceptors } from './interceptors/installInterceptors';
import cancelRequestInterceptor from './interceptors/cancelRequest';

import { cacheRequestAdapter } from './adapters/cacheRequestAdapter';
import { retryRequestAdapter } from './adapters/retryRequestAdapter';

export default {
    interceptors: {
        cancelRequestInterceptor
    },
    adapters: {
        cacheRequestAdapter,
        retryRequestAdapter
    },
    install:{
        installInterceptors,
        bootstrapInstallInterceptors
    }
}
