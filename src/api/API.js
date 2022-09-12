const { handlerResponse } = require("../utils/Util");

class API {
    constructor(service) {
        this.service = service;
    }

    insert = (req, res) => {
        let data = req.body, id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.insert(data, id));
    };

    update = (req, res) => {
        let data = req.body, id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.update(data, id));
    };

    delete = (req, res) => {
        let id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.delete(id));
    };

    find = (req, res) => {
        let id = parseInt(req.params.id);
        handlerResponse(res, () => this.service.find(id));
    };

    list = (req, res) => {
        handlerResponse(res, () => this.service.list());
    };
}

module.exports = API;