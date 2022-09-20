'use strict';
const serverless = require('serverless-http');
const Service = require('../core/service/ServiceFactory');
const StudyAPI = require('../core/api/StudyAPI');
const run = require('../core/utils/function');

const api = new StudyAPI(Service.study);

const exp = run(api, (api, app) => {
    app.get(`/${api.service.fileName}/:id/movies`, api.movies);
});

module.exports = exp;
module.exports.handler = serverless(exp);