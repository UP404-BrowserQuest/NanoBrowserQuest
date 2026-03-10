import { createClient } from "redis";

export const { REDIS_PORT, REDIS_HOST, REDIS_USERNAME, REDIS_PASSWORD, REDIS_DB_INDEX, DEPOSIT_SEED, NODE_ENV } =
  process.env;

export let redisClient = null;
export async function connectRedisInstance() {
  const redisUrl = `redis://${REDIS_HOST}:${REDIS_PORT}`;

  redisClient = createClient({
    url: redisUrl,
    database: Number(REDIS_DB_INDEX) || 0,
    socket: {
      // Internal Render networking can be slow to wake up
      connectTimeout: 20000, 
      keepAlive: 5000,
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
    }
  });

  redisClient.on("error", err => console.log("Redis Client Error", err));
  
  // Use a try-catch here so the game doesn't crash if Redis is slow
  try {
      await redisClient.connect();
      console.log("Connected to Redis server successfully!!");
  } catch (e) {
      console.error("CRITICAL: Redis connection failed!", e);
  }

  return redisClient;
}

// Example usage
connectRedisInstance()
  .then(() => {
    // console.log("Connected to Redis server successfully123!");
    // You can now use the client for Redis operations
    // Don't forget to close the connection when you're done
    // client.quit();
  })
  .catch(err => {
    console.error("Failed to connect to Redis:", err);
  });
