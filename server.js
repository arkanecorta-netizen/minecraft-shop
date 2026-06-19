const express = require("express");
const cors = require("cors");
const path = require("path");

const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

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
        ],

        notification_url:
          "https://minecraft-shop-onnd.onrender.com/webhook",

        back_urls: {
          success:
            "https://minecraft-shop-onnd.onrender.com/success",
          failure:
            "https://minecraft-shop-onnd.onrender.com/failure",
          pending:
            "https://minecraft-shop-onnd.onrender.com/pending"
        },

        auto_return: "approved"
      }
    });

    res.json({
      success: true,
      url: result.init_point
    });

  } catch (error) {
    console.error("Error creando preferencia:");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("========== WEBHOOK ==========");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("=============================");

    if (req.body.type === "payment") {
      const paymentId = req.body.data?.id;

      console.log("Pago recibido:");
      console.log("ID:", paymentId);

      // Aquí luego podrás:
      // - Consultar el pago
      // - Verificar si está approved
      // - Dar el rango VIP en LuckPerms
    }

    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/success", (req, res) => {
  res.send(`
    <h1>✅ Pago aprobado</h1>
    <p>Gracias por tu compra.</p>
  `);
});

app.get("/failure", (req, res) => {
  res.send(`
    <h1>❌ Pago rechazado</h1>
    <p>Inténtalo nuevamente.</p>
  `);
});

app.get("/pending", (req, res) => {
  res.send(`
    <h1>⏳ Pago pendiente</h1>
    <p>Estamos esperando la confirmación.</p>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});