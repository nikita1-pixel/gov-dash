"use strict";

var _require = require('pg'),
    Pool = _require.Pool;

require('dotenv').config();

var pool = new Pool({
  user: 'postgres',
  // Your pgAdmin username (usually 'postgres')
  host: 'localhost',
  database: 'gov_dashboard',
  // The name of the database you created in pgAdmin
  password: '1234',
  // Your pgAdmin password
  port: 5433
});
pool.connect(function (err, client, release) {
  if (err) {
    return console.error('❌ Database connection error:', err.stack);
  }

  console.log('✅ Connected to PostgreSQL successfully');
  release();
});
module.exports = {
  query: function query(text, params) {
    return pool.query(text, params);
  }
};