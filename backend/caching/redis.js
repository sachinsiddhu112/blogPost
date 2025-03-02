import { LRUCache } from "lru-cache";


const client = new LRUCache({
  max: 100, // Maximum 100 items
  ttl: 1000 * 60 * 5, // 5 minutes TTL
});

export default client;