import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import { ENV } from "./env.js";

// initialize arcjet with security rules
export const aj = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // shield protect app from common attacks like SQL injection, XSS, CSRF, etc.
    shield({
      mode: "LIVE",
    }),
    //   bot detection - block all bots except search engine bots
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    //  rate limiting - with token bucket algorithm
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // 1 token per interval
      capacity: 15, // maximum tokens in the bucket
      interval: 10, // interval in seconds
    }),
  ],
});
