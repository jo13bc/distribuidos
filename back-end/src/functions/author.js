'use strict';
const serverless = require('serverless-http');
const Service = require('../service/ServiceFactory');
const AuthorAPI = require('../api/AuthorAPI');

const api = new AuthorAPI(Service.author);

const exp = run(api);

module.exports = exp;
module.exports.handler = serverless(exp);