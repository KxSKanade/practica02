// src/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

let config;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  config = {
    host: url.hostname,
    port: url.port,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    waitForConnections: true,
    connectionLimit: 10
  };
} else {
  config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  };
}

const pool = mysql.createPool(config);
module.exports = pool;