'use strict';
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fs = require('fs');
const exp = express();

const app = express.Router();
const nameDB = "library";
const nameColle = "file";
const client = new MongoClient(
    `${process.env.MONGODB_URI.replace('"', '')}`, { useNewUrlParser: true, useUnifiedTopology: true }
);

async function db(callback, nameColle_ = nameColle) {
    const conexion = await client.connect();
    const result = await callback(conexion.db(nameDB).collection(nameColle_));
    await client.close();
    return result;
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

app.get('/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.findOne({ song: new ObjectId(_id) })
    ).then(study =>  {
        study._id = study.song;
        study.song = undefined;
        if (study) res.status(200).json(success(study));
        else res.status(404).json(error('No existe la canción'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
/*
app.post('/', async (req, res) => {
    try {
        req.body.song = new ObjectId(req.body.song);
        req.body.src = fs.readFileSync(req.body.location);
    } catch (err) {
        res.status(404).json(error(`${err}`));
        return;
    }
    db(conexion =>
        conexion.insertOne(req.body)
    ).then(study => {
        res.status(200).json(success(study, 'El archivo fue insertado exitosamente'));
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
    db(conexion =>
        conexion.deleteOne({ song: new ObjectId(_id) })
    ).then(study => {
        res.status(200).json(success(study, 'El archivo fue eliminado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
*/
exp.use(bodyParser.json());
exp.use('/.netlify/functions/file', app);
module.exports = exp;
module.exports.handler = serverless(exp);