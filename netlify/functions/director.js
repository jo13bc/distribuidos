'use strict';
const express = require('express');
const serverless = require('serverless-http');
const exp = express();
const bodyParser = require('body-parser');

let movies = [{
        "id": 1,
        "name": "Brad Bird",
        "birth_year": "24 de septiembre de 1957",
        "nationality": "Estadounidense",
        "movies": [9, 10],
        "image": "BradBird.jpg"
    },
    {
        "id": 2,
        "name": "Erico Casarosa",
        "birth_year": "19 de octubre de 1971",
        "nationality": "Italiano",
        "movies": [4],
        "image": "EnricoCasarosa.jpg"
    },
    {
        "id": 3,
        "name": "Jennifer Yuh Nelson",
        "birth_year": "1972",
        "nationality": "Sur Coreana",
        "movies": [3],
        "image": "Jennifer_Yuh_Nelson.jpg"
    },
    {
        "id": 4,
        "name": "John Lasseter",
        "birth_year": "1957",
        "nationality": "Estadounidense",
        "movies": [1, 11],
        "image": "JohnLasseter.jpg"
    },
    {
        "id": 5,
        "name": "Pete Docter",
        "birth_year": "9 de octubre de 1968",
        "nationality": "Estadounidense",
        "movies": [7, 12],
        "image": "petedocter.png"
    },
    {
        "id": 6,
        "name": "Phil Lord",
        "birth_year": "12 de julio de 1975",
        "nationality": "Estadounidense",
        "movies": [2],
        "image": "PhilLord.png"
    },
    {
        "id": 7,
        "name": "Pierre Coffin",
        "birth_year": "1 de noviembre de 1967",
        "nationality": "Francés",
        "movies": [5],
        "image": "pierrecoffin.jpeg"
    },
    {
        "id": 8,
        "name": "Rob Minkoff",
        "birth_year": "11 de agosto de 1962",
        "nationality": "Estadounidense",
        "movies": [8],
        "image": "RobMinkoff.jpg"
    },
    {
        "id": 9,
        "name": "Ron Clements",
        "birth_year": "25 de abril de 1953",
        "nationality": "Estadounidense",
        "movies": [6],
        "image": "RonClements.jpg"
    }
];

const app = express.Router();
app.get('/', (req, res) => {
    res.status(200).json(movies);
});
app.get('/:id', (req, res) => {
    let movie = movies.find(i => i.id == req.params.id);
    if (movie == undefined)
        res.status(404).send({ code: 404, message: 'El director no existe' });
    else
        res.status(200).json(movie);
});
app.post('/:id', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index != -1)
        res.status(404).send({ code: 404, message: 'El director ya existe' });
    else {
        movies.push(req.body);
        res.status(200).send({ code: 200, message: 'El director fue insertado exitosamente' });
    }
});
app.put('/', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send({ code: 404, message: 'El director no existe' });
    else {
        movies[index] = req.body;
        res.status(200).send({ code: 200, message: 'El director fue actualizado exitosamente' });
    }
});
app.delete('/:id', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send({ code: 404, message: 'El director no existe' });
    else {
        movies = movies.filter(i => i.id != req.params.id);
        res.status(200).send({ code: 200, message: 'El director fue eliminado exitosamente' });
    }
});


exp.use(bodyParser.json());
exp.use('/.netlify/functions/director', app);
module.exports = exp;
module.exports.handler = serverless(exp);