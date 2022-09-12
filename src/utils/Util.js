const fs = require('fs');

function urlFromData(name) {
    return `${__dirname}\\..\\data\\${name}.json`;
}

function readData(fileName) {
    let result = [];
    let url = urlFromData(fileName);
    try {
        result = fs.readFileSync(url, { encoding: 'utf8' });
        result = JSON.parse(result);
    } catch (err) {
        console.error(err);
    }
    return result;
}

function writeData(fileName, data) {
    let url = urlFromData(fileName);
    let json = JSON.stringify(data);
    try {
        fs.writeFileSync(url, json, { encoding: 'utf8' });
    } catch (err) {
        console.error(err);
    }
}

function toCamelCase(str) {
    return str
        .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
}

function handlerResponse(res, transaction) {
    try {
        res.send(transaction());
    } catch (error) {
        res.status(404).send({ code: 404, message: error });
        console.error(error);
    }
}



module.exports = { readData, writeData, toCamelCase, handlerResponse };