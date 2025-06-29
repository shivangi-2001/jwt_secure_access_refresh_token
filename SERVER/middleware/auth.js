// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { accessTokenSecret } = require('../config');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('JWT ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, accessTokenSecret, (err, payload) => {
    if (err) {
      // Token might be expired, malformed, or signature invalid
      return res.status(401).json({ message: 'Access token expired or invalid' });
    }

    req.user = payload; // Save decoded payload to req.user
    next();
  });
};
