// import redis from "../services/redisClient";


// export const cacheMiddleware = async (req, res, next) => {
//   try {
//     const cacheKey = "allUsers"; // Unique key for this API cache
//     const cachedData = await redis.get(cacheKey);

//     if (cachedData) {
//       return res.json({ source: "cache", data: JSON.parse(cachedData) });
//     }

//     res.locals.cacheKey = cacheKey;
//     next();
//   } catch (error) {
//     console.error("Redis Error:", error);
//     next(); // Continue even if Redis fails
//   }
// };

// export const setCache = async (key, data, expiry = 3600) => {
//   await redis.set(key, JSON.stringify(data), "EX", expiry);
// };
