const express = require("express");
const cors = require("cors");
const routes = require('./routes')
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3333;

// app.get('/', (res, req) => {
//   return res.send({ message: "Boas-vindas a API Temtem" });
// })

app.use(routes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});