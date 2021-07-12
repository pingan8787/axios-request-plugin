(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios')) :
    typeof define === 'function' && define.amd ? define(['axios'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.axiosRequestPlugin = factory(global.axios));
}(this, (function (axios) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

    // 用于根据当前请求的信息，生成请求 Key
    var generateReqKey = function (config) {
        var method = config.method, url = config.url, params = config.params, data = config.data;
        return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
    };
    var isCacheLike = function (cache) {
        return !!(cache.set && cache.get && cache["delete"] && cache.clear
            && typeof cache.get === 'function' && typeof cache.set === 'function'
            && typeof cache["delete"] === 'function' && typeof cache.clear === 'function');
    };

    var pendingRequest = new Map();
    var addPendingRequest = function (config) {
        var requestKey = generateReqKey(config);
        // 用于把当前请求信息添加到pendingRequest对象中
        config.cancelToken = config.cancelToken || new axios__default['default'].CancelToken(function (cancel) {
            if (!pendingRequest.has(requestKey)) {
                pendingRequest.set(requestKey, cancel);
            }
        });
    };
    var removePendingRequest = function (config) {
        var requestKey = generateReqKey(config);
        // 检查是否存在重复请求，若存在则取消已发的请求
        if (pendingRequest.has(requestKey)) {
            var cancelToken = pendingRequest.get(requestKey);
            cancelToken(requestKey);
            pendingRequest["delete"](requestKey);
        }
    };
    var requestInterceptors$1 = {
        fulfilled: function (config) {
            removePendingRequest(config);
            addPendingRequest(config);
            return config;
        },
        rejected: function (error) {
            return Promise.reject(error);
        }
    };
    var responseInterceptors$1 = {
        fulfilled: function (response) {
            removePendingRequest(response.config);
            return response;
        },
        rejected: function (error) {
            removePendingRequest(error.config || {});
            if (axios__default['default'].isCancel(error)) {
                console.log("已取消的重复请求：" + error.message);
            }
            else {
                console.log("异常情况");
            }
            return Promise.reject(error);
        }
    };
    var cancelRequestInterceptor = {
        request: requestInterceptors$1,
        response: responseInterceptors$1
    };

    var requestInterceptors = {
        fulfilled: function (config) {
            return config;
        },
        rejected: function (error) {
            return Promise.reject(error);
        }
    };
    var responseInterceptors = {
        fulfilled: function (response) {
            return response.data || response;
        },
        rejected: function (error) {
            return Promise.reject(error);
        }
    };
    var handleRequestInterceptor = {
        request: requestInterceptors,
        response: responseInterceptors
    };

    var defaultInterceptors = [
        handleRequestInterceptor,
        cancelRequestInterceptor
    ];
    var toArray = function (target) {
        var type = typeof target;
        var result = [];
        if (type === "object") {
            if (Array.isArray(target)) {
                result = target;
            }
            else {
                result.push(target);
            }
        }
        return result;
    };
    // 手动装载拦截器列表
    var installInterceptors = function (axios, interceptors) {
        if (!axios)
            return;
        interceptors = toArray(interceptors);
        if (interceptors && interceptors.length > 0) {
            interceptors.forEach(function (interceptor) {
                var request = interceptor.request, response = interceptor.response;
                axios.interceptors.request.use(request.fulfilled, request.rejected);
                axios.interceptors.response.use(response.fulfilled, response.rejected);
            });
        }
        return axios;
    };
    // 自动装载所有拦截器
    var bootstrapInstallInterceptors = function (axios) {
        if (!axios)
            return;
        return installInterceptors(axios, defaultInterceptors);
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var MemoryCache = {
        data: {},
        get: function (key) {
            var cacheItem = this.data[key];
            if (!cacheItem)
                return null;
            var isExpired = Date.now() - cacheItem.now > cacheItem.maxAge;
            isExpired && this["delete"](key);
            return isExpired ? null : cacheItem.value;
        },
        set: function (key, value, maxAge) {
            if (maxAge === void 0) { maxAge = 0; }
            this.data[key] = {
                maxAge: maxAge,
                value: value,
                now: Date.now()
            };
        },
        "delete": function (key) {
            return delete this.data[key];
        },
        clear: function () {
            this.data = {};
        }
    };

    /*
        请求缓存适配器
        
        adapter：预增强的 Axios 适配器对象；
        options：缓存配置对象，该对象支持 4 个属性，分别用于配置不同的功能：
        options.maxAge：全局设置缓存的最大时间；
        options.enabledByDefault：是否启用缓存，默认为 true；
        options.cacheFlag：缓存标志，用于配置请求 config 对象上的缓存属性；
        options.defaultCache：用于设置使用的缓存对象。
    */
    var cacheRequestAdapter = function (adapter, options) {
        var maxAge = options.maxAge, _a = options.enabledByDefault, enabledByDefault = _a === void 0 ? true : _a, _b = options.cacheFlag, cacheFlag = _b === void 0 ? "cache" : _b, _c = options.defaultCache, defaultCache = _c === void 0 ? MemoryCache : _c;
        return function (config) {
            config.url; var _a = config.method, method = _a === void 0 ? "" : _a; config.params; var forceUpdate = config.forceUpdate;
            var useCache = config[cacheFlag] !== undefined && config[cacheFlag] !== null
                ? config[cacheFlag]
                : enabledByDefault;
            // 处理 Get 请求，目前考虑到的是只有 Get 请求需要做数据缓存
            if (useCache && method.toLowerCase() === 'get') {
                var cache_1 = isCacheLike(useCache) ? useCache : defaultCache;
                var requestKey_1 = generateReqKey(config);
                var responsePromise = cache_1.get(requestKey_1); // 从缓存中获取请求key对应的响应对象
                if (!responsePromise || forceUpdate) { // 缓存未命中/失效或强制更新时，则重新请求数据
                    responsePromise = (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var reason_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, adapter(config)];
                                case 1: return [2 /*return*/, _a.sent()]; // 使用默认的 xhrAdapter 发送请求
                                case 2:
                                    reason_1 = _a.sent();
                                    cache_1["delete"](requestKey_1);
                                    throw reason_1;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })();
                    cache_1.set(requestKey_1, responsePromise, maxAge); // 保存请求返回的响应对象
                    return responsePromise; // 返回已保存的响应对象
                }
                return responsePromise;
            }
            return adapter(config); // 使用默认的xhrAdapter发送请求
        };
    };

    /*
        重试请求适配器增强
        
        adapter：预增强的 Axios 适配器对象；
        options：缓存配置对象，该对象支持 4 个属性，分别用于配置不同的功能：
        options.times：全局设置请求重试的次数；
        options.delay：全局设置请求延迟的时间，单位是 ms。
    */
    var retryRequestAdapter = function (adapter, options) {
        var _a = options.times, times = _a === void 0 ? 0 : _a, _b = options.delay, delay = _b === void 0 ? 300 : _b;
        return function (config) {
            var _a = config.retryTimes, retryTimes = _a === void 0 ? times : _a, _b = config.retryDelay, retryDelay = _b === void 0 ? delay : _b;
            var __retryCount = 0;
            var request = function () { return __awaiter(void 0, void 0, void 0, function () {
                var error_1, delay_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, adapter(config)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_1 = _a.sent();
                            // 1. 判断是否进行重试
                            if (!retryTimes || __retryCount >= retryTimes) {
                                return [2 /*return*/, Promise.reject(error_1)];
                            }
                            __retryCount++; // 增加重试次数
                            delay_1 = new Promise(function (resolve) {
                                setTimeout(function () {
                                    resolve();
                                }, retryDelay);
                            });
                            // 3. 重新发送请求
                            return [2 /*return*/, delay_1.then(function () {
                                    return request();
                                })];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            return request();
        };
    };

    var index = {
        interceptors: {
            cancelRequestInterceptor: cancelRequestInterceptor
        },
        adapters: {
            cacheRequestAdapter: cacheRequestAdapter,
            retryRequestAdapter: retryRequestAdapter
        },
        install: {
            installInterceptors: installInterceptors,
            bootstrapInstallInterceptors: bootstrapInstallInterceptors
        }
    };

    return index;

})));
