const express = require('express');
const { registerUser, loginUser } = require('./src/controllers/auth');
const { getWallet, topup } = require('./src/controllers/wallet');
const { authenticate } = require('./src/middleware/auth');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

app.get('/api/wallet', authenticate, getWallet);
app.post('/api/wallet/topup', authenticate, topup);

app.get('/', (req, res) => {
  res.send('Welcome to the wallet app');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
