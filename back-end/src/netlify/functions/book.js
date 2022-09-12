'use strict';
const serverless = require('serverless-http');
const Service = require('../service/ServiceFactory');
const BookAPI = require('../api/BookAPI');

const api = new BookAPI(Service.book);

const exp = run(api);

module.exports = exp;
module.exports.handler = serverless(exp);