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
app.get('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (!id || id === -1) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.findOne({ id })
    ).then(study => {
        if (study) res.status(200).json(success(study));
        else res.status(404).json(error('No existe el estudio'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.post('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    req.body.id = (!id || id === -1) ? undefined : id;
    db(conexion =>
        conexion.insertOne(req.body)
    ).then(study => {
        res.status(200).json(success(study, 'El estudio fue insertado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.put('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (!id || id === -1) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.updateOne({ id }, { $set: req.body })
    ).then(study => {
        res.status(200).json(success(study, 'El estudio fue actualizado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.delete('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (!id || id === -1) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.deleteOne({ id })
    ).then(study => {
        res.status(200).json(success(study, 'El estudio fue eliminado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.get('/byMovie/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (!id || id === -1) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.find({ movies: id }).toArray()
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