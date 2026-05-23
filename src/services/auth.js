const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { findByEmail, save } = require('../repositories/auth');
const { save: saveWallet } = require('../repositories/wallet');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw Object.assign(new Error('name, email, and password are required'), { status: 400 });
  }

  if (await findByEmail(email)) {
    throw Object.assign(new Error('Email already registered'), { status: 409 });
  }

  const user = await save({
    id: crypto.randomUUID(),
    name,
    email,
    password: hashPassword(password),
  });

  const wallet = await saveWallet({
    id: crypto.randomUUID(),
    user_id: user.id,
  });

  return { user, wallet };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw Object.assign(new Error('email and password are required'), { status: 400 });
  }

  const user = await findByEmail(email);
  if (!user || user.password !== hashPassword(password)) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const { password: _, ...safeUser } = user;

  // Create a token that contains the user's id and email.
  // The token expires in 1 hour — after that the user must log in again.
  const token = jwt.sign(
    { id: safeUser.id, email: safeUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { user: safeUser, token };
}

module.exports = { register, login };
