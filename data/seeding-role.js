require('dotenv').config();
const client = require('./db');

(async () => {
  console.time('insertion data role');

  const query = `
      INSERT INTO "role" ("name")
      VALUES
        ('petsitter'),
        ('petowner')
  `;
  await client.query(query);

  await client.end();
  console.timeEnd('insertion data role');
})();
