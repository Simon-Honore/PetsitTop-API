require('dotenv').config();
const { faker } = require('@faker-js/faker');

faker.locale = 'fr';

const client = require('./db');

(async () => {
  console.time('insertion data user');

  const values = Array.from({ length: 10 }).map(() => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const city = faker.address.city();
    const postalCode = faker.address.zipCode('4###0');
    const presentation = faker.lorem.paragraphs(1);
    const availability = faker.datatype.boolean();
    const availabilityDetails = faker.lorem.paragraphs(1);

    return [
      `'${firstName}'`,
      `'${lastName}'`,
      `'${email}'`,
      '1234',
      `'${postalCode}'`,
      `'${city}'`,
      `'${presentation}'`,
      availability,
      `'${availabilityDetails}'`,
    ];
  });
  // On obtient un tableau de tableaux

  const valuesWithParenthesis = values.map((value) => `(${value})`);
  // On obtient un tableau de string

  // On transforme le tableau de string en string
  const query = `
      INSERT INTO "user" ("first_name", "last_name", "email", "password", "postal_code", "city", "presentation", "availability", "availability_details") VALUES
      ${valuesWithParenthesis}
  `;
  // console.log(query);
  await client.query(query);

  await client.end();
  console.timeEnd('insertion data user');
})();
