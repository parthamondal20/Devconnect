import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST, // "redis" in Docker
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => console.error("❌ Redis Error:", err));
client.on("connect", () => console.log("✅ Redis connected"));

// await client.connect();

export default client;
