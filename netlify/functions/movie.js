'use strict';
const { MongoClient } = require('mongodb');
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const exp = express();

const app = express.Router();
const nameDB = "store";
const nameColle = "movie";
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
    ).then(movies => {
        res.status(200).json(success(movies));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    })
});
app.get('/:_id', (req, res) => {
    let id = req.params._id
    if (!id || id === '-1') {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.findOne({ id })
    ).then(movie => {
        if (movie) res.status(200).json(success(movie));
        else res.status(404).json(error('No existe la película'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.post('/', (req, res) => {
    db(conexion =>
        conexion.insertOne(req.body)
    ).then(movie => {
        res.status(200).json(success(movie, 'La película fue insertada exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.put('/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id || _id === '-1') {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.updateOne({ _id }, { $set: req.body })
    ).then(movie => {
        res.status(200).json(success(movie, 'La película fue actualizada exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.delete('/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id || _id === '-1') {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.deleteOne({ _id })
    ).then(movie => {
        res.status(200).json(success(movie, 'La película fue eliminada exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});

app.get('/byDirector/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id || _id === '-1') {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.find({ directorId: _id }).toArray()
    ).then(movies => {
        if (movies) res.status(200).json(success(movies));
        else res.status(404).json(error('Las películas no existen'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});

app.get('/byStudy/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id || _id === '-1') {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.find({ studies: _id }).toArray()
    ).then(movies => {
        if (movies) res.status(200).json(success(movies));
        else res.status(404).json(error('Las películas no existen'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});

exp.use(bodyParser.json());
exp.use('/.netlify/functions/movie', app);
module.exports = exp;
module.exports.handler = serverless(exp);