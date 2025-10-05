// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export function setCache(key: string, data: any, ttl = 300000) { // 5 minutes default
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

export function getCache(key: string) {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

export function clearCache() {
  cache.clear()
}

export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  }
}

// Cache with automatic cleanup
export function setCacheWithCleanup(key: string, data: any, ttl = 300000) {
  setCache(key, data, ttl)
  
  // Clean up expired entries
  const now = Date.now()
  for (const [k, v] of cache.entries()) {
    if (now - v.timestamp > v.ttl) {
      cache.delete(k)
    }
  }
}
