const { register, login } = require('../services/auth');

async function registerUser(req, res) {
  try {
    const user = await register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const user = await login(req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

module.exports = { registerUser, loginUser };
