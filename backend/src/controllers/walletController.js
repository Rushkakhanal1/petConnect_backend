const Wallet = require('../models/Wallet');

// ------------------- GET WALLET BY DAYCARE -------------------
exports.getWalletByDaycare = async (req, res) => {
  try {
    const { daycareId } = req.params;
    const wallet = await Wallet.findOne({ daycare: daycareId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ------------------- CREDIT WALLET -------------------
exports.creditWallet = async (daycareId, amount, description) => {
  let wallet = await Wallet.findOne({ daycare: daycareId });

  if (!wallet) {
    wallet = new Wallet({ daycare: daycareId, balance: 0, transactions: [] });
  }

  wallet.balance += amount;
  wallet.transactions.push({ type: 'credit', amount, description });
  await wallet.save();

  return wallet;
};

// ------------------- DEBIT WALLET -------------------
exports.debitWallet = async (daycareId, amount, description) => {
  let wallet = await Wallet.findOne({ daycare: daycareId });
  if (!wallet) throw new Error('Wallet not found');

  if (wallet.balance < amount) throw new Error('Insufficient balance');

  wallet.balance -= amount;
  wallet.transactions.push({ type: 'debit', amount, description });
  await wallet.save();

  return wallet;
};

// ------------------- REFUND WALLET -------------------
exports.refundWallet = async (daycareId, amount, description) => {
  // Refund is basically a credit with a "refund" note
  return await exports.creditWallet(daycareId, amount, `Refund: ${description}`);
};
