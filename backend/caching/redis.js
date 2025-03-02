import ioredis from 'ioredis';

const client = new ioredis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default client;