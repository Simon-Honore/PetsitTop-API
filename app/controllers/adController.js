const debug = require('debug')('opet:adController');

const adDataMapper = require('../models/adDataMapper');

const adController = {
  async getAdsByUserId(request, response) {
    debug('getAdsByUserId');
    const { id } = request.params;
    const ads = await adDataMapper.findAdsByUserId(id);
    response.status(200).json(ads);
  },
};

module.exports = adController;
