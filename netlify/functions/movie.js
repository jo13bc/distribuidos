'use strict';
const express = require('express');
const serverless = require('serverless-http');
const exp = express();
const bodyParser = require('body-parser');

let movies = [{
        "id": 1,
        "name": "Bichos - Una aventura en miniatura",
        "directorId": 4,
        "studies": [2, 4],
        "image": "bichos.jpeg"
    },
    {
        "id": 2,
        "name": "Lluvia de hamburguesas",
        "directorId": 6,
        "studies": [5],
        "image": "CloudyWithAchanceOfMeatballs.jpg"
    },
    {
        "id": 3,
        "name": "Kung Fu Panda 2",
        "directorId": 3,
        "studies": [1, 3],
        "image": "Kung_fu_panda.jpeg"
    },
    {
        "id": 4,
        "name": "Luca",
        "directorId": 2,
        "studies": [2, 4],
        "image": "Luca.jpg"
    },
    {
        "id": 5,
        "name": "Los Minios",
        "directorId": 7,
        "studies": [6],
        "image": "minions.jpeg"
    },
    {
        "id": 6,
        "name": "Moana",
        "directorId": 9,
        "studies": [2, 7],
        "image": "Moana.jpg"
    },
    {
        "id": 7,
        "name": "Monsters Inc",
        "directorId": 5,
        "studies": [2, 4],
        "image": "monstersinc.webp"
    },
    {
        "id": 8,
        "name": "Señor Peabody y Sherman",
        "directorId": 8,
        "studies": [1, 3],
        "image": "PeabodyAndSherman.jpg"
    },
    {
        "id": 9,
        "name": "Ratatouille",
        "directorId": 1,
        "studies": [2, 4],
        "image": "Ratatouille.jpeg"
    },
    {
        "id": 10,
        "name": "Los increíbles",
        "directorId": 1,
        "studies": [2, 4],
        "image": "TheIncredibles.jpg"
    },
    {
        "id": 11,
        "name": "Toy Story",
        "directorId": 4,
        "studies": [2, 4],
        "image": "ToyStory.jpg"
    },
    {
        "id": 12,
        "name": "UP - una aventura de altura",
        "directorId": 5,
        "studies": [2, 4],
        "image": "Up.jpeg"
    }
];

const app = express.Router();
app.get('/', (req, res) => {
    res.status(200).json(movies);
});
app.get('/:id', (req, res) => {
    let movie = movies.find(i => i.id == req.params.id);
    if (movie == undefined)
        res.status(404).send({ code: 404, message: 'La película no existe' });
    else
        res.status(200).json(movie);
});
app.post('/:id', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index != -1)
        res.status(404).send({ code: 404, message: 'La película ya existe' });
    else {
        movies.push(req.body);
        res.status(200).send({ code: 200, message: 'La película fue insertada exitosamente' });
    }
});
app.put('/:id', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send({ code: 404, message: 'La película no existe' });
    else {
        movies[index] = req.body;
        res.status(200).send({ code: 200, message: 'La película fue actualizada exitosamente' });
    }
});
app.delete('/:id', (req, res) => {
    let index = movies.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send({ code: 404, message: 'La película no existe' });
    else {
        movies = movies.filter(i => i.id != req.params.id);
        res.status(200).send({ code: 200, message: 'La película fue eliminada exitosamente' });
    }
});

app.get('/:array/byDirector', (req, res) => {
    let result = movies.filter(i => req.params.array.includes(i.id));
    if (result == undefined)
        res.status(404).send({ code: 404, message: 'Las películas no existen' });
    else
        res.status(200).json(result);
});

app.get('/:array/byStudy', (req, res) => {
    let result = movies.filter(i => req.params.array.includes(i.id));
    if (result == undefined)
        res.status(404).send({ code: 404, message: 'Las películas no existen' });
    else
        res.status(200).json(result);
});

exp.use(bodyParser.json());
exp.use('/.netlify/functions/movie', app);
module.exports = exp;
module.exports.handler = serverless(exp);