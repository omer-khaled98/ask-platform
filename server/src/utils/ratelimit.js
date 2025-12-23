// server/src/utils/ratelimit.js
import rateLimit from 'express-rate-limit';

export const publicInquiryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 دقيقة
  max: 8,              // 8 طلبات/دقيقة لكل IP
  standardHeaders: true,
  legacyHeaders: false,
});
