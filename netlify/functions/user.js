"use strict";
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const exp = express();

const app = express.Router();
const nameDB = "store";
const nameColle = "user";
const client = new MongoClient(`${process.env.MONGODB_URI.replace('"', "")}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function db(callback, param = undefined) {
  const conexion = await client.connect();
  const result = await callback(
    conexion.db(nameDB).collection(nameColle),
    param
  );
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
  console.error(message);
  return response(404, message, undefined);
}

app.get("/", async (req, res) => {
  db(conexion => conexion.find({}).toArray())
    .then(users => {
      res.status(200).json(success(users));
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
  db(conexion => conexion.findOne({ _id: new ObjectId(_id) }))
    .then(user => {
      if (user) res.status(200).json(success(user));
      else res.status(404).json(error("No existe el usuario"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
app.post("/", (req, res) => {
  db(conexion => conexion.insertOne(req.body))
    .then(user => {
      res
        .status(200)
        .json(success(user, "El usuario fue insertado exitosamente"));
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
  db(conexion =>
    conexion.updateOne({ _id: new ObjectId(_id) }, { $set: req.body })
  )
    .then(user => {
      res
        .status(200)
        .json(success(user, "El usuario fue actualizado exitosamente"));
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
  db(conexion => conexion.deleteOne({ _id: new ObjectId(_id) }))
    .then(user => {
      res
        .status(200)
        .json(success(user, "El usuario fue eliminado exitosamente"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});
function sing(user) {
  let data = { user_id: user._id, email: data.username };
  let expire = { expiresIn: "2h" };
  return { data, token: jwt.sign(user, process.env.TOKEN_KEY, expire) };
}
app.post("/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(404).json(error("El usuario y contraseña son requeridos"));
    return;
  }
  db(conexion => conexion.findOne({ username: req.body.username }))
    .then(async user => {
      if (!await bcrypt.compare(user.password, req.body.password)) {
        throw "Contraseña incorrecta";
      }
      res.status(200).json(success(sing(user), "El usuario fue validado"));
    })
    .catch(err => {
      res.status(404).json(error(`${err}`));
    });
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/user", app);
module.exports = exp;
module.exports.handler = serverless(exp);
