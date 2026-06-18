const express = require("express");
const cors = require("cors");
const path = require("path");

const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos HTML
app.use(express.static(path.join(__dirname, "public")));

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/crear-pago", async (req, res) => {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: "VIP Minecraft",
            quantity: 1,
            currency_id: "ARS",
            unit_price: 1000
          }
        ]
      }
    });

    res.json({
      success: true,
      url: result.init_point
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});