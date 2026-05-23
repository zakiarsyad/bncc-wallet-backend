const supabase = require('../config/db');

async function findByEmail(email) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  return data;
}

async function save({ id, name, email, password }) {
  const { data, error } = await supabase
    .from('users')
    .insert({ id, name, email, password })
    .select('id, name, email, status, created_at, updated_at')
    .single();

  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

module.exports = { findByEmail, save };
