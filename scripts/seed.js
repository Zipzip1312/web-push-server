const { sql } = require('@vercel/postgres');
const { subscriptions } = require('../db/placeholder-data.js');

const seed = true;

async function seedSubscriptions() {
  try {

    const dropTable = await sql`DROP TABLE IF EXISTS subscriptions`;
    console.log(`Dropped "subscriptions" table`);

    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "subscriptions" table if it doesn't exist
    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    userid NUMERIC NOT NULL,
    username TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    expirationTime timestamp,
    keys JSON NOT NULL
  );
`;

    console.log(`Created "subscriptions" table`);

    const insertedSubscriptions = [];
    if (seed) {
      // Insert data into the "subscriptions" table
      for (const sub of subscriptions) {
        const { userid, username, endpoint, expirationTime, keys } = sub;

        insertedSubscriptions.push(await sql`
        INSERT INTO subscriptions (userid, username, endpoint, expirationTime, keys)
        VALUES (${userid}, ${username}, ${endpoint}, ${expirationTime}, ${keys})
        ON CONFLICT (id) DO NOTHING;`,);
      }

      console.log(`Seeded ${insertedSubscriptions.length} subscriptions`);
    }

    return { dropTable, createTable };
  } catch (error) {
    console.error('Error seeding subscriptions:', error);
    throw error;
  }
}

(async () => {
  await seedSubscriptions();
})();
