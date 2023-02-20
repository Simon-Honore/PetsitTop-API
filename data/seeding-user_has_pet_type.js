require('dotenv').config();

const client = require('./db');

(async () => {
  console.time('insertion data user_has_pet_type');

  const query = `
    INSERT INTO "user_has_pet_type" ("user_id", "pet_type_id") VALUES
      
  `;
  await client.query(query);

  await client.end();
  console.timeEnd('insertion data user_has_pet_type');
})();
