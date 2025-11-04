import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || './settle.db';

// Read the schema file
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Execute schema
db.exec(schema, (err) => {
  if (err) {
    console.error('Error creating schema:', err.message);
    process.exit(1);
  }
  console.log('Database schema created successfully');

  // Run migrations
  db.all("PRAGMA table_info(settlements)", (err, tableInfo) => {
    if (err) {
      console.error('Migration error:', err);
      db.close();
      return;
    }

    const hasColumn = tableInfo.some(col => col.name === 'transaction_signature');

    if (!hasColumn) {
      db.run('ALTER TABLE settlements ADD COLUMN transaction_signature TEXT', (err) => {
        if (err) {
          console.error('Error adding column:', err);
        } else {
          console.log('✅ Migration: Added transaction_signature column to settlements table');
        }
        db.close();
      });
    } else {
      console.log('ℹ️ Migration: transaction_signature column already exists');
      db.close();
    }
  });
});
