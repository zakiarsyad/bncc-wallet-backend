const { findByUserId, updateBalance } = require('../repositories/wallet');

async function getWallet(userId) {
  const wallet = await findByUserId(userId);

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { status: 404 });
  }

  return wallet;
}

async function topup(userId, amount) {
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw Object.assign(new Error('amount must be a positive number'), { status: 400 });
  }

  const wallet = await findByUserId(userId);
  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { status: 404 });
  }

  return updateBalance(userId, wallet.balance + amount);
}

module.exports = { getWallet, topup };
