"use strict";
const Redis = require("redis");
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const { movieSchema } = require("./entities");
const exp = express();

const app = express.Router();
const schema = movieSchema;
const client = Redis.createClient(`${process.env.REDISDB_URI.replace('"', '')}`);

async function db(callback) {
  const repository = client.fetchRepository(schema);
  await repository.createIndex();
  const result = await callback(repository);
  return result;
}
async function dbWithBefore(before, callback, schema) {
  const repository = client.fetchRepository(schema);
  await repository.createIndex();
  const resultBefore = await before(repository);
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

app.get("/", async (req, res) => {
  db(repository => repository.search().return.all())
    .then(studies => {
      res.status(200).json(success(studies));
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
    .then(study => {
      if (study) res.status(200).json(success(study));
      else res.status(404).json(error("No existe el estudio"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
app.post("/", (req, res) => {
  db(repository => repository.createAndSave(req.body))
    .then(study => {
      res
        .status(200)
        .json(success(study, "El estudio fue insertado exitosamente"));
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
  req.body._id = new ObjectId(_id);
  db(async repository => {
    const entity = await repository.fetch(_id);
    entity.name = req.body.name;
    entity.birth_year = req.body.name;
    entity.nationality = req.body.name;
    entity.image = req.body.name;
    return repository.save(entity);
  })
    .then(study => {
      res
        .status(200)
        .json(success(study, "El estudio fue actualizado exitosamente"));
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
    .then(study => {
      res
        .status(200)
        .json(success(study, "El estudio fue eliminado exitosamente"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
app.get("/byMovie/:_id", (req, res) => {
  let _id = req.params._id;
  if (!_id) {
    res.status(404).json(error("Identificador inválido"));
    return;
  }
  db(repository => repository.fetch(_id));
  dbWithBefore(
    repository => repository.fetch(_id),
    (repository, movie) =>
      repository.search().where(_id).does.in(movie.studies).return.all(),
    movieSchema
  )
    .then(studies => {
      if (studies) res.status(200).json(success(studies));
      else res.status(404).json(error("Los estudios no existen"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/study", app);
module.exports = exp;
module.exports.handler = serverless(exp);
