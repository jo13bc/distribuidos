'use strict';
const serverless = require('serverless-http');
const Service = require('../core/service/ServiceFactory');
const MovieAPI = require('../core/api/MovieAPI');
const run = require('../core/utils/function');

const api = new MovieAPI(Service.movie);

const exp = run(api, (api, app) => {
    app.get(`/${api.service.fileName}/:id/director`, api.director);
    app.get(`/${api.service.fileName}/:id/studies`, api.studies);
});

module.exports = exp;
module.exports.handler = serverless(exp);