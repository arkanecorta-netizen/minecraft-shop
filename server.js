const express = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

app.get("/", (req, res) => {
  res.send("Servidor de tienda funcionando");
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
    console.error("Error Mercado Pago:", error);

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