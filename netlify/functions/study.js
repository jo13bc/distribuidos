'use strict';
const express = require('express');
const serverless = require('serverless-http');
const exp = express();
const bodyParser = require('body-parser');

let movies = [{
        "id": 1,
        "name": "21st Century Fox",
        "movies": [3, 8],
        "image": "21stCenturyFox.jpg"
    },
    {
        "id": 2,
        "name": "Walt Disney Pictures",
        "movies": [1, 4, 6, 7, 9, 10, 11, 12],
        "image": "Disney.jpg"
    },
    {
        "id": 3,
        "name": "DreamWorks",
        "movies": [3, 8],
        "image": "DreamWorks.jpg"
    },
    {
        "id": 4,
        "name": "Pixar Animation Studios",
        "movies": [1, 4, 7, 9, 10, 11, 12],
        "image": "Pixar.jpg"
    },
    {
        "id": 5,
        "name": "Sony Pictures Home Entertainment",
        "movies": [2],
        "image": "SonyPictures.jpg"
    },
    {
        "id": 6,
        "name": "Universal Pictures",
        "movies": [5],
        "image": "UniversalPictures.jpeg"
    },
    {
        "id": 7,
        "name": "Walt Disney Animation Studios",
        "movies": [6],
        "image": "WaltDisneyAnimationStudios.jpg"
    }
];

const app = express.Router();
app.get('/', (req, res) => {
    res.status(200).json(movies);
});
app.get('/:id', (req, res) => {
    let movie = movies.find(i => i.id == req.params.id);
    if (movie == undefined)
        res.status(404).send({ code: 404, message: 'El estudio no existe' });
    else
        res.status(200).json(movie);
});
app.post('/:id', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index != -1)
        res.status(404).send({ code: 404, message: 'El estudio ya existe' });
    else {
        req.body.id = movies.length + 1;
        movies.push(req.body);
        res.status(200).send({ code: 200, message: 'El estudio fue insertado exitosamente' });
    }
});
app.put('/:id', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send({ code: 404, message: 'El estudio no existe' });
    else {
        movies[index] = req.body;
        res.status(200).send({ code: 200, message: 'El estudio fue actualizado exitosamente' });
    }
});
app.delete('/:id', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send({ code: 404, message: 'El estudio no existe' });
    else {
        movies = movies.filter(i => i.id != req.params.id);
        res.status(200).send({ code: 200, message: 'El estudio fue eliminado exitosamente' });
    }
});

app.get('/:array/byMovie', (req, res) => {
    let result = movies.filter(i => req.params.array.includes(i.id));
    if (result == undefined)
        res.status(404).send({ code: 404, message: 'Los estudios no existen' });
    else
        res.status(200).json(result);
});


exp.use(bodyParser.json());
exp.use('/.netlify/functions/study', app);
module.exports = exp;
module.exports.handler = serverless(exp);