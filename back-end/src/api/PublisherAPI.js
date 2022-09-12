const API = require('./API');
const { handlerResponse } = require('../utils/Util');

class PublisherAPI extends API {
    constructor(service) {
        super(service);
    }

    books = (req, res) => {
        let id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.listBookById(id));
    }
};

module.exports = PublisherAPI;