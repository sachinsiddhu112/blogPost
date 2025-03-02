import ioredis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

console.log('process.env.UPSTASH_REDIS_REST_URL', process.env.UPSTASH_REDIS_REST_URL)
console.log('process.env.UPSTASH_REDIS_REST_TOKEN', process.env.UPSTASH_REDIS_REST_TOKEN)
const client = new ioredis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default client;