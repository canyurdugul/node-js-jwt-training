const redis = require('redis');

// Create a Redis client
const client = redis.createClient();

// Handle Redis connection events
client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

client.connect();

// Export the Redis client
module.exports = client;
