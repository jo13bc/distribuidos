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
      else res.status(404).json(error("No existe la película"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
app.post("/", (req, res) => {
  req.body.directorId = new ObjectId(req.body.directorId);
  req.body.studies = req.body.studies.map(id => new ObjectId(id));
  db(repository => repository.createAndSave(req.body))
    .then(movie => {
      res
        .status(200)
        .json(success(movie, "La película fue insertada exitosamente"));
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
  req.body.directorId = new ObjectId(req.body.directorId);
  req.body.studies = req.body.studies.map(id => new ObjectId(id));

  db(async repository => {
    const entity = await repository.fetch(_id);
    entity.name = req.body.name;
    entity.birth_year = req.body.name;
    entity.nationality = req.body.name;
    entity.image = req.body.name;
    return repository.save(entity);
  })
    .then(movie => {
      res
        .status(200)
        .json(success(movie, "La película fue actualizada exitosamente"));
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
    .then(movie => {
      res
        .status(200)
        .json(success(movie, "La película fue eliminada exitosamente"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});

app.get("/byDirector/:_id", (req, res) => {
  let _id = req.params._id;
  if (!_id) {
    res.status(404).json(error("Identificador inválido"));
    return;
  }
  db(repository =>
    repository.search().where("directorId").does.equal(_id).return.all()
  )
    .then(movies => {
      if (movies) res.status(200).json(success(movies));
      else res.status(404).json(error("Las películas no existen"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});

app.get("/byStudy/:_id", (req, res) => {
  let _id = req.params._id;
  if (!_id) {
    res.status(404).json(error("Identificador inválido"));
    return;
  }
  db(repository =>
    repository.search().where(_id).does.in("studies").return.all()
  )
    .then(movies => {
      if (movies) res.status(200).json(success(movies));
      else res.status(404).json(error("Las películas no existen"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/movie", app);
module.exports = exp;
module.exports.handler = serverless(exp);
