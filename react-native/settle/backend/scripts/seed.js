import db from '../src/db/database.js';
import { generateId, generateInviteCode } from '../src/utils/helpers.js';

const seedDatabase = async () => {
  try {
    console.log('Seeding database with dummy data...');

    // 1. Get the main user (assuming at least one user exists)
    const mainUser = await db.get('SELECT * FROM users LIMIT 1');
    if (!mainUser) {
      console.error('Error: No users found. Please create a user in the app first before seeding.');
      return;
    }
    console.log(`Seeding data for user: ${mainUser.name} (ID: ${mainUser.id})`);

    // 2. Create dummy users to act as friends and group members
    // Using valid Solana public keys (base58 encoded, 32-44 characters)
    const dummyUsers = [
      { id: generateId(), pubkey: '7WKaHxMy54Mn5JPpETqiwwkcyJLmkcsrjwfvUnDqPpdN', name: 'Alice', phone: '+11234567890' },
      { id: generateId(), pubkey: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', name: 'Bob', phone: '+10987654321' },
      { id: generateId(), pubkey: 'FkWNnFZrJvYWEeXhAjQWeUMqCsXJmzw8KxBvGPfXwqKv', name: 'Charlie', phone: '+15555555555' },
    ];

    for (const user of dummyUsers) {
      await db.run('INSERT OR IGNORE INTO users (id, pubkey, name, phone, is_profile_complete) VALUES (?, ?, ?, ?, 1)', [user.id, user.pubkey, user.name, user.phone]);
    }
    console.log(`- Created ${dummyUsers.length} dummy users.`);

    // 3. Create dummy groups created by the main user
    const groups = [
      { id: generateId(), name: 'Bali Trip', type: 'trip', created_by: mainUser.id },
      { id: generateId(), name: 'Shared Apartment', type: 'home', created_by: mainUser.id },
      { id: generateId(), name: 'Project "Phoenix"', type: 'other', created_by: mainUser.id },
    ];

    for (const group of groups) {
      await db.run('INSERT OR IGNORE INTO groups (id, name, type, created_by, invite_code) VALUES (?, ?, ?, ?, ?)', [group.id, group.name, group.type, group.created_by, generateInviteCode()]);
    }
    console.log(`- Created ${groups.length} groups.`);

    // 4. Add members to the groups
    // Add main user to all created groups
    for (const group of groups) {
      await db.run('INSERT OR IGNORE INTO group_members (id, group_id, user_id) VALUES (?, ?, ?)', [generateId(), group.id, mainUser.id]);
    }

    // Add dummy users to various groups
    await db.run('INSERT OR IGNORE INTO group_members (id, group_id, user_id) VALUES (?, ?, ?)', [generateId(), groups[0].id, dummyUsers[0].id]); // Alice in Bali Trip
    await db.run('INSERT OR IGNORE INTO group_members (id, group_id, user_id) VALUES (?, ?, ?)', [generateId(), groups[1].id, dummyUsers[1].id]); // Bob in Shared Apartment
    await db.run('INSERT OR IGNORE INTO group_members (id, group_id, user_id) VALUES (?, ?, ?)', [generateId(), groups[2].id, dummyUsers[0].id]); // Alice in Project Phoenix
    await db.run('INSERT OR IGNORE INTO group_members (id, group_id, user_id) VALUES (?, ?, ?)', [generateId(), groups[2].id, dummyUsers[2].id]); // Charlie in Project Phoenix
    
    console.log('- Added users to groups.');

    // 5. Create friend relationships for the main user
    // Main user is friends with Alice
    await db.run('INSERT OR IGNORE INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, ?)', [generateId(), mainUser.id, dummyUsers[0].id, 'accepted']);
    await db.run('INSERT OR IGNORE INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, ?)', [generateId(), dummyUsers[0].id, mainUser.id, 'accepted']);
    
    // Bob sent a friend request to the main user
    await db.run('INSERT OR IGNORE INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, ?)', [generateId(), dummyUsers[1].id, mainUser.id, 'pending']);

    console.log('- Created friend relationships.');

    // 6. Create dummy expenses and participants
    console.log('- Creating dummy expenses...');

    // Expense 1: In Bali Trip (groups[0]), paid by mainUser
    const expense1Id = generateId();
    const expense1Amount = 120.50;
    const baliTripMembers = await db.all('SELECT user_id FROM group_members WHERE group_id = ?', [groups[0].id]);
    if (baliTripMembers.length > 0) {
      const expense1Share = (expense1Amount / baliTripMembers.length).toFixed(2);
      await db.run('INSERT INTO expenses (id, group_id, description, amount, paid_by, date) VALUES (?, ?, ?, ?, ?, ?)', [expense1Id, groups[0].id, 'Dinner at beach club', expense1Amount, mainUser.id, '2025-11-10']);
      for (const member of baliTripMembers) {
        await db.run('INSERT OR IGNORE INTO expense_participants (id, expense_id, user_id, share) VALUES (?, ?, ?, ?)', [generateId(), expense1Id, member.user_id, expense1Share]);
      }
    }

    // Expense 2: In Shared Apartment (groups[1]), paid by Bob (dummyUsers[1])
    const expense2Id = generateId();
    const expense2Amount = 900;
    const apartmentMembers = await db.all('SELECT user_id FROM group_members WHERE group_id = ?', [groups[1].id]);
    if (apartmentMembers.length > 0) {
      const expense2Share = (expense2Amount / apartmentMembers.length).toFixed(2);
      await db.run('INSERT INTO expenses (id, group_id, description, amount, paid_by, date) VALUES (?, ?, ?, ?, ?, ?)', [expense2Id, groups[1].id, 'Monthly Rent', expense2Amount, dummyUsers[1].id, '2025-11-01']);
      for (const member of apartmentMembers) {
        await db.run('INSERT OR IGNORE INTO expense_participants (id, expense_id, user_id, share) VALUES (?, ?, ?, ?)', [generateId(), expense2Id, member.user_id, expense2Share]);
      }
    }

    // Expense 3: In Project Phoenix (groups[2]), paid by Alice (dummyUsers[0])
    const expense3Id = generateId();
    const expense3Amount = 75;
    const projectMembers = await db.all('SELECT user_id FROM group_members WHERE group_id = ?', [groups[2].id]);
    if (projectMembers.length > 0) {
      const expense3Share = (expense3Amount / projectMembers.length).toFixed(2);
      await db.run('INSERT INTO expenses (id, group_id, description, amount, paid_by, date) VALUES (?, ?, ?, ?, ?, ?)', [expense3Id, groups[2].id, 'Software Licenses', expense3Amount, dummyUsers[0].id, '2025-11-05']);
      for (const member of projectMembers) {
        await db.run('INSERT OR IGNORE INTO expense_participants (id, expense_id, user_id, share) VALUES (?, ?, ?, ?)', [generateId(), expense3Id, member.user_id, expense3Share]);
      }
    }

    console.log('- Created dummy expenses and splits.');

    console.log('\nDatabase seeding complete! 🎉');

  } catch (error) {
    console.error('\nError seeding database:', error);
  } finally {
    await db.close();
  }
};

seedDatabase();