'use strict';
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const exp = express();

const app = express.Router();
const nameDB = "library";
const nameColle = "song";
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

app.get('/', async (req, res) => {
    db(conexion =>
        conexion.find({}).toArray()
    ).then(entities => {
        res.status(200).json(success(entities));
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
        else res.status(404).json(error('No existe la canción'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.post('/', (req, res) => {
    req.body.playlist = new ObjectId(req.body.playlist);
    db(conexion =>
        conexion.insertOne(req.body)
    ).then(study => {
        res.status(200).json(success(study, 'La canción fue insertada exitosamente'));
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
    req.body.playlist = new ObjectId(req.body.playlist);
    db(conexion =>
        conexion.updateOne({ _id: new ObjectId(_id) }, { $set: req.body })
    ).then(study => {
        res.status(200).json(success(study, 'La canción fue actualizada exitosamente'));
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
        res.status(200).json(success(study, 'La canción fue eliminada exitosamente'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.get('/byPlaylist/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion => conexion.find({ playlist: new ObjectId(_id) }).toArray()
    ).then(entities => {
        if (entities) res.status(200).json(success(entities));
        else res.status(404).json(error('Las canciones no existen'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});
app.get('/file/:_id', (req, res) => {
    let _id = req.params._id
    if (!_id) {
        res.status(404).json(error('Identificador inválido'));
        return;
    }
    db(conexion => conexion.findOne({ _id: new ObjectId(_id) }), 'file')
    .then(file => {
        if (file) res.status(200).json(success(file));
        else res.status(404).json(error('El archivo no existen'));
    }).catch(err => {
        res.status(404).json(error(`${err}`));
    });
});

exp.use(bodyParser.json());
exp.use('/.netlify/functions/song', app);
module.exports = exp;
module.exports.handler = serverless(exp);