require('dotenv').config();
const { faker } = require('@faker-js/faker');

faker.locale = 'fr';

const client = require('./db');

(async () => {
  console.time('insertion data pet');

  const values = Array.from({ length: 10 }).map(() => {
    const name = faker.name.firstName();
    const presentation = faker.lorem.paragraphs(1);
    const user_id = faker.datatype.number({ min: 1, max: 10 });
    const pet_type_id = faker.datatype.number({ min: 1, max: 8 });

    return [
      `'${name}'`,
      `'${presentation}'`,
      user_id,
      pet_type_id,
    ];
  });
  // On obtient un tableau de tableaux

  const valuesWithParenthesis = values.map((value) => `(${value})`);
  // On obtient un tableau de string

  // On transforme le tableau de string en string
  const query = `
      INSERT INTO "pet" ("name", "presentation", "user_id", "pet_type_id") VALUES
      ${valuesWithParenthesis}
  `;
  console.log(query);
  await client.query(query);

  await client.end();
  console.timeEnd('insertion data pet');
})();
