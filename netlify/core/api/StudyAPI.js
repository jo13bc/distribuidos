const API = require('./API');
const { handlerResponse } = require('../utils/Util');

class StudyAPI extends API {
    constructor(service) {
        super(service);
    }

    movies = (req, res) => {
        let id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.listMoviesById(id));
    }
};

module.exports = StudyAPI;