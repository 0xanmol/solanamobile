import db from '../database.js';

export async function up() {
  try {
    // Check if column already exists
    const tableInfo = await db.all("PRAGMA table_info(settlements)");
    const hasColumn = tableInfo.some(col => col.name === 'transaction_signature');

    if (!hasColumn) {
      await db.run('ALTER TABLE settlements ADD COLUMN transaction_signature TEXT');
      console.log('✅ Added transaction_signature column to settlements table');
    } else {
      console.log('ℹ️ transaction_signature column already exists');
    }
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

export async function down() {
  // SQLite doesn't support DROP COLUMN easily, so we skip the down migration
  console.log('⚠️ Cannot easily drop column in SQLite. Manual intervention required if needed.');
}
