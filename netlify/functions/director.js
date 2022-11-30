"use strict";
const Redis = require("redis");
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const { directorSchema } = require("./entities");
const exp = express();

const app = express.Router();
const schema = directorSchema;
const client = Redis.createClient(`${process.env.REDISDB_URI.replace('"', '')}`);

async function db(callback) {
  const repository = client.fetchRepository(schema);
  await repository.createIndex();
  const result = await callback(repository);
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

app.get("/", async (req, res) => {
  db(repository => repository.search().return.all())
    .then(movies => {
      res.status(200).json(success(movies));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
app.get("/:_id", (req, res) => {
  let _id = req.params._id;
  if (!_id) {
    res.status(404).json(error("Identificador inválido"));
    return;
  }
  db(repository => repository.fetch(_id))
    .then(movie => {
      if (movie) res.status(200).json(success(movie));
      else res.status(404).json(error("No existe el director"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
app.post("/", (req, res) => {
  db(repository => repository.createAndSave(req.body))
    .then(director => {
      res
        .status(200)
        .json(success(director, "El director fue insertado exitosamente"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
app.put("/:_id", (req, res) => {
  let _id = req.params._id;
  if (!_id) {
    res.status(404).json(error("Identificador inválido"));
    return;
  }
  db(async repository => {
    const entity = await repository.fetch(_id);
    entity.name = req.body.name;
    entity.birth_year = req.body.name;
    entity.nationality = req.body.name;
    entity.image = req.body.name;
    return repository.save(entity);
  })
    .then(director => {
      res
        .status(200)
        .json(success(director, "El director fue actualizado exitosamente"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
app.delete("/:_id", (req, res) => {
  let _id = req.params._id;
  if (!_id) {
    res.status(404).json(error("Identificador inválido"));
    return;
  }
  db(repository => repository.remove(_id))
    .then(director => {
      res
        .status(200)
        .json(success(director, "El director fue eliminado exitosamente"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/director", app);
module.exports = exp;
module.exports.handler = serverless(exp);
