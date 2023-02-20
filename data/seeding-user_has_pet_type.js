require('dotenv').config();

const client = require('./db');

(async () => {
  console.time('insertion data user_has_pet_type');

  const query = `
    INSERT INTO "user_has_pet_type" ("user_id", "pet_type_id") VALUES
      (1,1),
      (1,2),
      (1,5),
      (3,1),
      (3,2),
      (3,3),
      (3,4),
      (3,5),
      (3,6),
      (3,7),
      (3,8),
      (4,1),
      (6,2),
      (7,3),
      (7,4),
      (7,5),
      (7,6),
      (8,7),
      (9,1),
      (9,2),
      (9,3),
      (9,4),
      (9,5),
      (9,6),
      (9,7),
      (9,8);
  `;
  await client.query(query);

  await client.end();
  console.timeEnd('insertion data user_has_pet_type');
})();
