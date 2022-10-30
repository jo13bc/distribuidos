'use strict';
const { MongoClient, ObjectId } = require('mongodb');
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

async function db(callback, param = undefined) {
    const conexion = await client.connect();
    const result = await callback(conexion.db(nameDB).collection(nameColle), param);
    await client.close();
    return result;
}

async function dbWithBefore(before, callback) {
    const conexion = await client.connect();
    const resultBefore = await before(conexion.db(nameDB));
    await client.close();
    return db(callback, resultBefore);
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
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion =>
        conexion.findOne({ _id: new ObjectId(_id) })
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
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    req.body._id = new ObjectId(_id);
    db(conexion =>
        conexion.updateOne({ _id: new ObjectId(_id) }, { $set: req.body })
    ).then(study => {
        res.status(200).json(success(study, 'El estudio fue actualizado exitosamente'));
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
    ).then(study => {
        res.status(200).json(success(study, 'El estudio fue eliminado exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.get('/byMovie/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    dbWithBefore(
        conexion => conexion.collection("movie").findOne({ _id: new ObjectId(_id) }),
        (conexion, movie) => conexion.find({ _id: { $in : movie.studies} }).toArray()
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