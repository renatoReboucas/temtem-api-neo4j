const express = require("express");
const TemtemController = require('./controller/TemtemController')


const routes = express.Router();

routes.get("/", (req, res) => {
  return res.send("temtem api");
});

routes.get('/createTemtem', TemtemController.roboTemtem )
routes.get('/getTemtem', TemtemController.getTemtem )

module.exports = routes;