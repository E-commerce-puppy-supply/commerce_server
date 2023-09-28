const { Client } = require('pg');

const connectionString = 'https://e-commerce-node.fly.dev' || 'https://localhost:5432/testing';

const client = new Client({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

module.exports = client;
