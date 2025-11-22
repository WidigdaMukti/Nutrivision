class DashboardCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 menit

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`✅ Cache set: ${key}`);
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) {
      console.log(`❌ Cache miss: ${key}`);
      return null;
    }
    
    if (Date.now() - item.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      console.log(`⏰ Cache expired: ${key}`);
      return null;
    }
    
    console.log(`✅ Cache hit: ${key}`);
    return item.data;
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
      console.log(`🗑️ Cache cleared: ${key}`);
    } else {
      this.cache.clear();
      console.log('🗑️ All cache cleared');
    }
  }
}

export const dashboardCache = new DashboardCache();