const jwt = require('jsonwebtoken');

// This middleware protects routes that require the user to be logged in.
// Usage: add it before your route handler, e.g. app.get('/profile', authenticate, getProfile)
//
// The client must send the token in the Authorization header like this:
//   Authorization: Bearer <token>
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  // The header must exist and start with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // grab the part after "Bearer "

  try {
    // jwt.verify checks the signature AND the expiry automatically
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload to req so the next handler can use it
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };
