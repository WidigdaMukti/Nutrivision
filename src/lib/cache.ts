const profileCache = new Map();

export const cacheProfile = (userId: string, data: any) => {
  profileCache.set(userId, {
    data,
    timestamp: Date.now()
  });
};

export const getCachedProfile = (userId: string) => {
  const cached = profileCache.get(userId);
  if (!cached) return null;
  
  // Cache expired setelah 5 menit
  if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
    profileCache.delete(userId);
    return null;
  }
  
  return cached.data;
};

export const clearProfileCache = (userId: string) => {
  profileCache.delete(userId);
};