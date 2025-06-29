const express = require('express');
const router = express.Router();

const { register, login, refresh, logout } = require('../controller/auth');
const { loginLimiter } = require('../middleware/rate-limit');

router.post("/register", register);
router.post("/login", loginLimiter, login);

router.post('/refresh', refresh);
router.post('/logout', logout);
module.exports = router;