'use strict';
const { MongoClient } = require('mongodb');
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const exp = express();

const app = express.Router();
const nameDB = "store";
const nameColle = "study";
const client = new MongoClient(
    `${process.env.MONGODB_URI.replace('"', '')}`, { useNewUrlParser: true, useUnifiedTopology: true }
);

async function db(callback) {
    const conexion = await client.connect();
    const result = await callback(conexion.db(nameDB).collection(nameColle));
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

app.get('/', async (req, res) => {
    db(conexion =>
        conexion.find({}).toArray()
    ).then(studies => {
        res.status(200).json(success(studies));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    })
});
app.get('/:_id', (req, res) => {
    let _id = parseInt(req.params._id);
    db(conexion =>
        conexion.findOne({ _id })
    ).then(study => {
        if (study) res.status(200).json(success(study));
        else res.status(404).json(error('No existe el estudio'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.post('/', (req, res) => {
    db(conexion =>
        conexion.insertOne(req.body)
    ).then(study => {
        res.status(200).json(success(study, 'El estudio fue insertado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.put('/:_id', (req, res) => {
    let _id = parseInt(req.params._id);
    db(conexion =>
        conexion.updateOne({ _id }, { $set: req.body })
    ).then(study => {
        res.status(200).json(success(study, 'El estudio fue actualizado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.delete('/:_id', (req, res) => {
    let _id = parseInt(req.params._id);
    db(conexion =>
        conexion.deleteOne({ _id })
    ).then(study => {
        res.status(200).json(success(study, 'El estudio fue eliminado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.get('/byMovie/:_id', (req, res) => {
    let _id = parseInt(req.params._id);
    db(conexion =>
        conexion.find({ movies: _id }).toArray()
    ).then(studies => {
        if (studies) res.status(200).json(success(studies));
        else res.status(404).json(error('Los estudios no existen'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});

exp.use(bodyParser.json());
exp.use('/.netlify/functions/study', app);
module.exports = exp;
module.exports.handler = serverless(exp);