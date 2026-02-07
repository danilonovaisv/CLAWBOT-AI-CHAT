import { createClient } from 'redis';
import { NextResponse } from 'next/server';

// Create a Redis client instance
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    // Initialize the Redis client with connection options
    // If you have a Redis URL, you can pass it as an option: { url: process.env.REDIS_URL }
    redisClient = createClient({
      // Add your Redis configuration here if needed
      // Example: 
      // url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    // Handle connection errors
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    // Connect to Redis if not already connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }

  return redisClient;
}

export const POST = async () => {
  try {
    // Get or create the Redis client
    const redis = await getRedisClient();
    
    // Fetch data from Redis
    const result = await redis.get("item");
    
    // Return the result in the response
    return new NextResponse(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    console.error('Error connecting to Redis or fetching data:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to connect to Redis or fetch data' }), 
      { status: 500 }
    );
  }
};

// Optional: Close the Redis connection when the server shuts down
if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
    process.exit(0);
  });
}