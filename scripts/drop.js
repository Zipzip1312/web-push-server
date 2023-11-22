const { sql } = require('@vercel/postgres');
const { messages, users } = require('../db/placeholder-data.js');

async function dropUsers() {
  try {
    const dropTable = await sql`DROP TABLE IF EXISTS users`;

    console.log(`Droped "users" table`);

    return { dropTable };
  } catch (error) {
    console.error('Error dropping users:', error);
    throw error;
  }
}

async function dropMessages() {
  try {
    const dropTable = await sql`DROP TABLE IF EXISTS messages`;

    console.log(`Droped "messages" table`);

    return { dropTable };
  } catch (error) {
    console.error('Error dropping messages:', error);
    throw error;
  }
}

(async () => {
  await dropUsers();
  await dropMessages();
})();
