const express = require('express');
const bodyParser = require('body-parser');

const exp = express();
const app = express.Router();

function addApp(api, callback = undefined) {
    app.post(`/${api.service.fileName}`, api.insert);
    app.put(`/${api.service.fileName}/:id`, api.update);
    app.delete(`/${api.service.fileName}/:id`, api.delete);
    app.get(`/${api.service.fileName}/:id`, api.find);
    app.get(`/${api.service.fileName}`, api.list);
    if (callback) {
        callback(api);
    }
}

function run(api) {
    addApp(api, api => {
        app.get(`/${api.service.fileName}/:id/books`, api.books);
    });
    exp.use(bodyParser.json());
    exp.use(`/.netlify/functions/${api.service.fileName}`, app);
    return exp;
}

module.exports = run;