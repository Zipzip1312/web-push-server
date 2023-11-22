const { sql } = require('@vercel/postgres');
const { messages, users } = require('../db/placeholder-data.js');

async function seedUsers() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "messages" table if it doesn't exist
    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        data TEXT NOT NULL UNIQUE
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async user => {
        return sql`
        INSERT INTO users (id, name, data)
        VALUES (${user.id}, ${user.name}, ${user.data})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedMessages() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "messages" table if it doesn't exist
    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    text TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "messages" table`);

    // Insert data into the "messages" table
    const insertedMessages = [];
    for (const message of messages) {
      insertedMessages.push(
        await sql`
        INSERT INTO messages (text, status, date)
        VALUES (${message.text}, ${message.status || 'no status'}, ${message.date || new Date()})
        ON CONFLICT (id) DO NOTHING;
      `,
      );
    }

    console.log(`Seeded ${insertedMessages.length} messages`);

    return {
      createTable,
      messages: insertedMessages,
    };
  } catch (error) {
    console.error('Error seeding messages:', error);
    throw error;
  }
}

(async () => {
  await seedUsers();
  await seedMessages();
})();
