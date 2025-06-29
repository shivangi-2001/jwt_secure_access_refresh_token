const { refreshTokenExpiresIn } = require("../config");
const { RefreshToken } = require("../model/refreshToken");
const { User } = require("../model/user");
const jwtUtils = require("../utils/jwt");


// Helper to convert "7d" to ms
function parseRefreshExpiry(value) {
    const days = parseInt(value);
    return days * 24 * 60 * 60 * 1000;
}

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    await User.create({ name, email, password });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Registering error", error: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwtUtils.generateAccessToken(user._id, "user");
    const refreshTokenStr = jwtUtils.generateRefreshToken(user._id);

    // Save refresh token to DB
    await RefreshToken.create({
      token: refreshTokenStr,
      userId: user._id,
      expiresAt: new Date(
        Date.now() + parseRefreshExpiry(refreshTokenExpiresIn)
      ),
    });

    return res.json({ accessToken, refreshToken: refreshTokenStr });
  } catch (err) {
    res.status(500).json({ message: "Login error", err: err.message });
  }
};

module.exports.refresh = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });
  
      const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
      if (!storedToken) return res.status(401).json({ message: 'Invalid refresh token' });
  
      const payload = jwtUtils.verifyRefreshToken(refreshToken);
      const newAccessToken = jwtUtils.generateAccessToken(payload.sub, 'user');
  
      // Rotate refresh token so the old one cannot be used again
      storedToken.revoked = true;
      await storedToken.save();
  
      const newRefreshTokenStr = jwtUtils.generateRefreshToken(payload.sub);
      await RefreshToken.create({
        token: newRefreshTokenStr,
        userId: payload.sub,
        expiresAt: new Date(Date.now() + parseRefreshExpiry(refreshTokenExpiresIn)),
      });
  
      return res.json({ accessToken: newAccessToken, refreshToken: newRefreshTokenStr });
    } catch (err) {
      return res.status(403).json({ message: 'Could not refresh token', error: err.message });
    }
};
  
module.exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revoked: true });
        return res.json({ message: 'Logged out' });
    } catch (err) {
        return res.status(500).json({ message: 'Logout error', error: err.message });
    }
};
  