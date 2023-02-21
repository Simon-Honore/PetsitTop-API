require('dotenv').config();
const { faker } = require('@faker-js/faker');

faker.locale = 'fr';

const client = require('./db');

(async () => {
  console.time('insertion data ad');

  const values = Array.from({ length: 10 }).map(() => {
    const title = faker.lorem.lines(1);
    const content = faker.lorem.paragraphs(3);
    const city = faker.address.city();
    const postal_code = faker.address.zipCode('4###0');
    const user_id = faker.datatype.number({ min: 1, max: 10 });

    return [
      `'${title}'`,
      `'${content}'`,
      `'${city}'`,
      `'${postal_code}'`,
      user_id,
    ];
  });
  // On obtient un tableau de tableaux

  const valuesWithParenthesis = values.map((value) => `(${value})`);
  // On obtient un tableau de string

  // On transforme le tableau de string en string
  const query = `
      INSERT INTO "ad" ("title", "content", "city", "postal_code", "user_id") VALUES
      ${valuesWithParenthesis}
  `;
  console.log(query);
  await client.query(query);

  await client.end();
  console.timeEnd('insertion data ad');
})();
