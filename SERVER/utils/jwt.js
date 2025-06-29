const jwt = require('jsonwebtoken');
const { accessTokenSecret, refreshTokenSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = require('../config/index');
const { v4: uuidv4 } = require('uuid');

exports.generateAccessToken = (userId, role) => {
  return jwt.sign(
    { sub: userId, role, jti: uuidv4() },  // jti helps protect against replay
    accessTokenSecret,
    { expiresIn: accessTokenExpiresIn }
  );
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    { sub: userId, jti: uuidv4() },
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiresIn }
  );
};

exports.verifyAccessToken = (token) => jwt.verify(token, accessTokenSecret);
exports.verifyRefreshToken = (token) => jwt.verify(token, refreshTokenSecret);
