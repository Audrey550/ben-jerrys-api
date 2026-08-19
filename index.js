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

app.post("/api/orders", (req, res) => {
  const newOrder = {
    id: orders.length + 1,
    customer: req.body.customer,
    iceCream: req.body.iceCream,
    totalPrice: req.body.totalPrice,
    status: "to_process"
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

app.patch("/api/orders/:id", (req, res) => {
  const id = Number(req.params.id);

  const order = orders.find((order) => order.id === id);

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  if (req.body.status) {
    order.status = req.body.status;
  }

  res.json(order);
});

app.delete("/api/orders/:id", (req, res) => {
  const id = Number(req.params.id);

  const orderIndex = orders.findIndex((order) => order.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  const deletedOrder = orders.splice(orderIndex, 1);

  res.json({
    message: "Order deleted",
    order: deletedOrder[0]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});