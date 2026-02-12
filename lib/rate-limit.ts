export class RateLimiter {
    private requests: Map<string, number[]>;
    private readonly windowMs: number;
    private readonly maxRequests: number;

    constructor(windowMs: number, maxRequests: number) {
        this.requests = new Map();
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
    }

    check(key: string): boolean {
        const now = Date.now();
        const timestamps = this.requests.get(key) || [];

        // Remove timestamps outside the window
        const validTimestamps = timestamps.filter(timestamp => now - timestamp < this.windowMs);

        if (validTimestamps.length >= this.maxRequests) {
            return false;
        }

        validTimestamps.push(now);
        this.requests.set(key, validTimestamps);
        return true;
    }
}

// Global instance to persist across requests in serverless-like environments (best effort)
export const globalRateLimiter = new RateLimiter(60 * 1000, 10); // 10 requests per minute per IP
