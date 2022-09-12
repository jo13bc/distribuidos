const API = require('./API');
const { handlerResponse } = require('../utils/Util');

class BookAPI extends API {
    constructor(bookService) {
        super(bookService);
    }

    author = (req, res) => {
        let id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.findAuthorById(id));
    }

    publisher = (req, res) => {
        let id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.findPublisherById(id));
    }
};

module.exports = BookAPI;