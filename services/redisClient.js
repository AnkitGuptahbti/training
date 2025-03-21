import Redis from "ioredis";

const redis = new Redis({
  host: "localhost", // Change to "redis" if using Docker
  port: 6379,
});

redis.on("connect", () => console.log("🔥 Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

export default redis;




// const redis = require("redis");

// const client = redis.createClient({
//   socket: {
//     host: "localhost", // Use 'redis' if your backend is inside Docker
//     port: 6379,
//   },
// });

// client.connect()
//   .then(() => console.log("Connected to Redis"))
//   .catch((err) => console.error("Redis Connection Error:", err));

// client.set("message", "Hello from Redis!", redis.print);
// client.get("message", (err, result) => {
//   if (err) console.error(err);
//   console.log("Get Response:", result);
// });

// module.exports = client;


////////**************************************************************///////////////////////////
// import Redis from "ioredis";

// // Connect to Redis in Docker
// const redis = new Redis({
//   host: "localhost",  // Use 'redis' instead of 'localhost' if your backend is also inside Docker
//   port: 6379,
// });




// redis.on("connect", () => console.log("🔥 Connected to Redis"));
// redis.on("error", (err) => console.error("Redis Error:", err));

// // Test Redis connection
// redis.set("message", "Hello from Redis!", (err, reply) => {
//   if (err) console.error(err);
//   console.log("Set Response:", reply);
// });

// redis.get("message", (err, result) => {
//   if (err) console.error(err);
//   console.log("Get Response:", result);
// });

// export default redis;
//////////////////////////*************************************************************/////////////////////////////


//rabit nq
// you have to make new application
// puranin application me produver aur jo new app me consumer 
//puranoi app se data bhenja 





