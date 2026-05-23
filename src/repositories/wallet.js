const supabase = require('../config/db');

async function findById(id) {
  const { data, error } = await supabase
    .from('wallets')
    .select('id, user_id, balance, currency, status, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw Object.assign(new Error(error.message), { status: 500 });
  }
  return data;
}

async function findByUserId(userId) {
  const { data, error } = await supabase
    .from('wallets')
    .select('id, user_id, balance, currency, status, created_at, updated_at')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw Object.assign(new Error(error.message), { status: 500 });
  }
  return data;
}

async function save({ id, user_id }) {
  const { data, error } = await supabase
    .from('wallets')
    .insert({ id, user_id, balance: 0, currency: 'IDR', status: 'active' })
    .select('id, user_id, balance, currency, status, created_at, updated_at')
    .single();

  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

async function updateBalance(userId, newBalance) {
  const { data, error } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('user_id', userId)
    .select('id, user_id, balance, currency, status, created_at, updated_at')
    .single();

  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

module.exports = { findById, findByUserId, save, updateBalance };
