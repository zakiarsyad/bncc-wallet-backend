const walletService = require('../services/wallet');

async function getWallet(req, res) {
  try {
    const wallet = await walletService.getWallet(req.user.id);
    res.status(200).json({ success: true, data: wallet });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function topup(req, res) {
  try {
    const wallet = await walletService.topup(req.user.id, req.body.amount);
    res.status(200).json({ success: true, data: wallet });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

module.exports = { getWallet, topup };
