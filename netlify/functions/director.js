'use strict';
const serverless = require('serverless-http');
const Service = require('../core/service/ServiceFactory');
const DirectorAPI = require('../core/api/DirectorAPI');
const run = require('../core/utils/function');

const api = new DirectorAPI(Service.director);

const exp = run(api, (api, app) => {
    app.get(`/${api.service.fileName}/:id/movies`, api.movies);
});

module.exports = exp;
module.exports.handler = serverless(exp);