require('dotenv').config();

const client = require('./db');

(async () => {
  console.time('insertion data user_has_role');

  const query = `
    INSERT INTO "user_has_role" ("user_id", "role_id") VALUES
     (1,1),
     (1,2),
     (2,2),
     (3,1),
     (4,1),
     (4,2),
     (5,2),
     (6,1),
     (6,2),
     (7,1),
     (7,2),
     (8,1),
     (9,1),
     (10,2);
  `;
  await client.query(query);

  await client.end();
  console.timeEnd('insertion data user_has_role');
})();
