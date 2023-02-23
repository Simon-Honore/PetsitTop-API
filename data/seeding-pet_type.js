require('dotenv').config();
const client = require('./db');

(async () => {
  console.time('insertion data pet_type');

  const query = `
      INSERT INTO "pet_type" ("name")
      VALUES
        ('chien'),
        ('chat'),
        ('lapin'),
        ('rongeur'),
        ('oiseau'),
        ('poisson'),
        ('reptile'),
        ('autre')
  `;
  await client.query(query);

  await client.end();
  console.timeEnd('insertion data pet_type');
})();
