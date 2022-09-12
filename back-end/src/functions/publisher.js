'use strict';
const serverless = require('serverless-http');
const Service = require('../service/ServiceFactory');
const PublisherAPI = require('../api/PublisherAPI');

const api = new PublisherAPI(Service.publisher);

const exp = run(api);

module.exports = exp;
module.exports.handler = serverless(exp);