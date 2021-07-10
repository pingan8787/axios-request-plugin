import { installInterceptors, bootstrapInstallInterceptors } from './interceptors/installInterceptors';
import CancelRequestInterceptor from './interceptors/cancelRequest';

import { cacheAdapterEnhancer } from './adapters/cacheRequestAdapter';

export default {
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
}
