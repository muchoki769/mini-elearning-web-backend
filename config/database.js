// backend/config/database.js
// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST ,
//   database: process.env.DB_NAME,  
//   password: process.env.DB_PASSWORD ,
//   port: process.env.DB_PORT 
// });

// module.exports = pool;




// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'elearning',
//   password: process.env.DB_PASSWORD || 'password',
//   port: process.env.DB_PORT || 5432,
// });

// // Test connection
// pool.on('connect', () => {
//   console.log('✅ Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//   console.error('❌ Database connection error:', err);
// });

// module.exports = pool;


const {Pool} = require('pg');
 require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL ,


    // user: process.env.PGUSER,
    // password: process.env.PGPASSWORD,
    // host: process.env.PGHOST,
    // database: process.env.PGDATABASE,
    // port: process.env.PGPORT,

    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false,

   
    // ssl: {
    //     rejectUnauthorized: false
    // },
   
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    client_encoding: 'utf8',
});

pool.query('SELECT NOW()')
 .then(() => console.log('Connected to NEONDB succesfully'))
 .catch(err => console.error('Database connection error:', err));


 pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(-1);
 })

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
    pool
};
// module.exports = pool;