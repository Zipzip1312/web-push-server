const { sql } = require('@vercel/postgres');
const { users, subscriptions } = require('../db/placeholder-data.js');

async function seedUsers() {
  try {
    const dropTable = await sql`DROP TABLE IF EXISTS users`;
    console.log(`Dropped "users" table`);

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
      dropTable,
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedSubscriptions() {
  try {
    const dropTable = await sql`DROP TABLE IF EXISTS subscriptions`;
    console.log(`Dropped "subscriptions" table`);

    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "subscriptions" table if it doesn't exist
    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    endpoint TEXT NOT NULL,
    expirationTime timestamp,
    keys JSON NOT NULL
  );
`;

    console.log(`Created "subscriptions" table`);

    // Insert data into the "subscriptions" table
    const insertedSubscriptions = [];
    for (const sub of subscriptions) {
      insertedSubscriptions.push(
        await sql`
        INSERT INTO subscriptions (endpoint, expirationTime, keys)
        VALUES (${sub.endpoint}, ${sub.expirationTime}, ${sub.keys})
        ON CONFLICT (id) DO NOTHING;
      `,
      );
    }

    console.log(`Seeded ${insertedSubscriptions.length} subscriptions`);

    return {
      dropTable,
      createTable,
      subscriptions: insertedSubscriptions,
    };
  } catch (error) {
    console.error('Error seeding subscriptions:', error);
    throw error;
  }
}

(async () => {
  await seedUsers();
  await seedSubscriptions();
})();
