



// 📝 Key Differences
// Approach	Best For	Accuracy	Flexibility
// Fixed Window (Your code)	Simple APIs	❌ Low	❌ No
// Sliding Window	Fair throttling	✅ High	❌ No
// Token Bucket	Smoother API experience	✅ High	✅ Yes
// import redis from "../services/redisClient.js";

const RATE_LIMIT = 5; // Max requests allowed
const TIME_WINDOW = 60; // In seconds (1 min)

const rateLimiter = async (req, res, next) => {
  const userIP = req.ip; // Identify user by IP (can use API key, user ID, etc.)
  const redisKey = `rate_limit:${userIP}`;

  try {
    // Get the current request count
    const requests = await redis.incr(redisKey);

    if (requests === 1) {
      // Set expiry only on the first request
      await redis.expire(redisKey, TIME_WINDOW);
    }

    if (requests > RATE_LIMIT) {
      return res.status(429).json({ message: "Too many requests. Try again later." });
    }

    next();
  } catch (err) {
    console.error("❌ Redis Rate Limit Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default rateLimiter;
