const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Servidor de tienda funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});