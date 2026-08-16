import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many authentication requests. Try again later.",
  },
});

export const transactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many transaction requests. Try again later.",
  },
});

export const analyticsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Too many analytics requests. Try again later.",
  },
});