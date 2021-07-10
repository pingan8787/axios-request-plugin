export const MemoryCache = {
    data: {},
    get(key){
        const cacheItem = this.data[key];
        if(!cacheItem) return null;
        const isExpired = Date.now() - cacheItem.now > cacheItem.maxAge;
        isExpired && this.delete(key);
        return isExpired ? null : cacheItem.value;
    },
    set(key, value, maxAge = 0){
        this.data[key] = {
            maxAge,
            value,
            now: Date.now()
        }
    },
    delete(key){
        return delete this.data[key];
    },
    clear(){
        this.data = {};
    }
}