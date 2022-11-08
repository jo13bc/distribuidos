'use strict';
const amqp = require('amqplib');
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');
const exp = express();
//const url = 'http://localhost:8888/.netlify/functions/song';
const url = 'https://proyecto-distribuidos-2.netlify.app/.netlify/functions/song';

const app = express.Router();
const queueName = "file";
const cloudamqp = 'amqps://biqxwomo:I6zPQm606ZOrXzwTRhVZNsFanM-mLB3F@shark.rmq.cloudamqp.com/biqxwomo';
//const cloudamqp = `${process.env.CLOUDAMQP_URL.replace('"', '')}`

async function ch(callback) {
    const conexion = await amqp.connect(cloudamqp);
    const channel = await conexion.createChannel();
    const result = await callback(channel);
    //channel.close();
    return result;
}

async function sendToQueue(request) {
    return await ch(async channel => await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(request))));
}

function response(status, message, body) {
    return { status, message, body };
}

function success(body, message = undefined) {
    return response(200, message, body);
}

function error(message) {
    return response(404, message, undefined);
}

function downloadFile(url, name) {
    let timeElapsed = Date.now();
    let urlFile = `data/songs/file_${name}_${timeElapsed}.mp3`;
    let file = fs.createWriteStream(urlFile);
    if (url.includes('https')) {
        https.get(url, async function (response) {
            response.pipe(file);
            file.on("finish", file.close);
        });
    } else {
        http.get(url, async function (response) {
            response.pipe(file);
            file.on("finish", file.close);
        });
    }
    return urlFile;
}

app.post('/', async (req, res) => {
    req.body.urlFile = downloadFile(req.body.url, 'new');
    sendToQueue({ method: 'INSERT', body: req.body })
        .then(async () => {
            res.status(200).json(success(undefined, 'La canción fue añadida a la cola para ser insertado exitosamente'));
        }).catch(err => {
            res.status(404).json(error(`${err}`));
        });
});

app.put('/:_id', async (req, res) => {
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    req.body.urlFile = downloadFile(req.body.url, _id);
    sendToQueue({ method: 'UPDATE', _id: _id, body: req.body })
        .then(() => {
            res.status(200).json(success(undefined, 'La canción fue añadida a la cola para ser actualizado exitosamente'));
        }).catch(err => {
            res.status(404).json(error(`${err}`));
        });
});

app.delete('/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    sendToQueue({ method: 'DELETE', _id: _id })
        .then(() => {
            res.status(200).json(success(undefined, 'La canción fue añadida a la cola para ser eliminado exitosamente'));
        }).catch(err => {
            res.status(404).json(error(`${err}`));
        });
});

function headers(method, body = undefined) {
    body = body ? JSON.stringify(body) : undefined;
    return { method, headers: { "Content-type": "application/json" }, body };
}

app.get('/', (req, res) => {
    ch(async channel => {
        let message = await channel.get(queueName, { 'noAck': true });
        while (message) {
            let result;
            const request = JSON.parse(message.content.toString());
            switch (request.method) {
                case "DELETE":
                    result = await fetch(`${url}/${request._id}`, headers('DELETE')).then(resp => resp.json());
                    break;
                case "UPDATE":
                    result = await fetch(`${url}/${request._id}`, headers('PUT', request.body)).then(resp => resp.json());
                    break;
                case "INSERT":
                    result = await fetch(`${url}/`, headers('POST', request.body)).then(resp => resp.json());
                    break;
            }
            message = await channel.get(queueName, { 'noAck': true });
            if (result && result.status >= 400) {
                throw result.message;
            }
            return result.message;
        }
    }).then(result => {
        res.status(200).json(success({ result }));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});

exp.use(bodyParser.json());
exp.use('/.netlify/functions/rabbit', app);
module.exports = exp;
module.exports.handler = serverless(exp);