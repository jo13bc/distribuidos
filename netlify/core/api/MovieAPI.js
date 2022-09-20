const API = require('./API');
const { handlerResponse } = require('../utils/Util');

class MovieAPI extends API {
    constructor(movieService) {
        super(movieService);
    }

    director = (req, res) => {
        let id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.findDirectorById(id));
    }

    studies = (req, res) => {
        let id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.findStudiesById(id));
    }
};

module.exports = MovieAPI;