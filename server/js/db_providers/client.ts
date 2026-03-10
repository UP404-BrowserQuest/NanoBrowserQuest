import { createClient } from "redis";

export const { REDIS_PORT, REDIS_HOST, REDIS_USERNAME, REDIS_PASSWORD, REDIS_DB_INDEX, DEPOSIT_SEED, NODE_ENV } =
  process.env;

export let redisClient = null;
export async function connectRedisInstance() {
  // Construct the URL: redis://host:port
  // Note: Internal hostnames on Render don't need passwords if configured that way, 
  // but we'll include logic for both.
  const auth = REDIS_PASSWORD ? `:${REDIS_PASSWORD}@` : "";
  const redisUrl = `redis://${auth}${REDIS_HOST}:${REDIS_PORT}`;

  console.log("~~~~~ Attempting to connect to:", `redis://***:***@${REDIS_HOST}:${REDIS_PORT}`);

  redisClient = createClient({
    url: redisUrl,
    database: Number(REDIS_DB_INDEX) || 0,
    socket: {
      connectTimeout: 10000,
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
    }
  });

  redisClient.on("error", err => console.log("Redis Client Error", err));
  redisClient.on("connect", () => console.log("Connected to Redis server successfully!!"));

  await redisClient.connect();
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
