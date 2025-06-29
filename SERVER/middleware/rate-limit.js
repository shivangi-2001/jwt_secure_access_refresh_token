const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  keyGenerator: (req) => req.body.email,
  message: 'Too many login attempts for this account. Please try again later.',
});
