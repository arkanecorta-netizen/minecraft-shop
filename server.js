const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

app.post("/crear-pago", async (req, res) => {
  try {

    const preference = {
      items: [
        {
          title: "Rango VIP Minecraft",
          quantity: 1,
          currency_id: "ARS",
          unit_price: 1000
        }
      ]
    };

    const result = await mercadopago.preferences.create(preference);

    res.json({
      success: true,
      url: result.body.init_point
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("Servidor iniciado");
});