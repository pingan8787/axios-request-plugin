import { installInterceptors, bootstrapInstallInterceptors } from './interceptors/installInterceptors';
import CancelRequestInterceptor from './interceptors/cancelRequest';

import { cacheRequestAdapter } from './adapters/cacheRequestAdapter';

export default {
    interceptors: {
        CancelRequestInterceptor
    },
    adapters: {
        cacheRequestAdapter
    },
    install:{
        installInterceptors,
        bootstrapInstallInterceptors
    }
}
