import rateLimit from "express-rate-limit";

// 10 requests per second (per IP)
export const secondLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests per second, please slow down.",
  },
});

// 100 requests per minute (per IP)
export const minuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests per minute, please try again later.",
  },
});
