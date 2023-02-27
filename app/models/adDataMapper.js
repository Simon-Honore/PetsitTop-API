const debug = require('debug')('opet:adDataMapper');
const client = require('./database');

const adDataMapper = {
  findAdsByUserId: async (id) => {
    debug('findAdsByUserId');
    const query = {
      text: `
        SELECT * FROM "ad"
        WHERE user_id = $1
      `,
      values: [id],
    };
    const results = await client.query(query);
    return results.rows;
  },

};

module.exports = adDataMapper;
