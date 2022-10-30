'use strict';
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const exp = express();

const app = express.Router();
const nameDB = "store";
const nameColle = "director";
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
    let _id = req.params._id;
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.findOne({ _id: new ObjectId(_id) })
    ).then(movie => {
        if (movie) res.status(200).json(success(movie));
        else res.status(404).json(error('No existe el director'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.post('/', (req, res) => {
    db(conexion =>
        conexion.insertOne(req.body)
    ).then(director => {
        res.status(200).json(success(director, 'El director fue insertado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.put('/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    req.body._id = new ObjectId(_id);
    db(conexion =>
        conexion.updateOne({ _id: new ObjectId(_id) }, { $set: req.body })
    ).then(director => {
        res.status(200).json(success(director, 'El director fue actualizado exitosamente'));
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
        conexion.deleteOne({ _id: new ObjectId(_id) })
    ).then(director => {
        res.status(200).json(success(director, 'El director fue eliminado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});


exp.use(bodyParser.json());
exp.use('/.netlify/functions/director', app);
module.exports = exp;
module.exports.handler = serverless(exp);