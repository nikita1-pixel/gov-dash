const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',           // Your pgAdmin username (usually 'postgres')
    host: 'localhost',
    database: 'gov_dashboard',    // The name of the database you created in pgAdmin
    password: '1234',  // Your pgAdmin password
    port: 5433,
});
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Database connection error:', err.stack);
    }
    console.log('✅ Connected to PostgreSQL successfully');
    release();
});
module.exports = {
    query: (text, params) => pool.query(text, params),
};