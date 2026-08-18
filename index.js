const express = require("express");
const flavors = require("./data/flavors");
const orders = require("./data/orders");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Ben & Jerry's API is running 🍦"
  });
});

app.get("/api/flavors", (req, res) => {
  res.json({
    flavors
  });
});

app.get("/api/flavors/:id", (req, res) => {
  const id = Number(req.params.id);

  const flavor = flavors.find((flavor) => flavor.id === id);

  if (!flavor) {
    return res.status(404).json({
      message: "Flavor not found"
    });
  }

  res.json(flavor);
});

app.get("/api/orders", (req, res) => {
  res.json({
    orders
  });
});

app.get("/api/orders/:id", (req, res) => {
  const id = Number(req.params.id);

  const order = orders.find((order) => order.id === id);

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  res.json(order);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});