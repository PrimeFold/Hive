import { Limiter } from "../../../lib/rateLimiter";
import  { type RateLimitRequestHandler } from 'express-rate-limit'

export const authLimiter:RateLimitRequestHandler = Limiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Login limit reached!",
});
