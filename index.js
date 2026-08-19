require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const flavors = require("./data/flavors");
const orders = require("./data/orders");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGODB_URI);

app.use(cors());
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

app.get("/api/orders", async (req, res) => {
  try {
    const database = client.db("ben_jerrys");
    const collection = database.collection("orders");

    const orders = await collection.find({}).toArray();

    res.json({
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const database = client.db("ben_jerrys");
    const collection = database.collection("orders");

    const order = await collection.findOne({ id: id });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message
    });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const database = client.db("ben_jerrys");
    const collection = database.collection("orders");

    const lastOrder = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const newId = lastOrder.length > 0 ? lastOrder[0].id + 1 : 1;

    const newOrder = {
      id: newId,
      customer: req.body.customer,
      iceCream: req.body.iceCream,
      totalPrice: req.body.totalPrice,
      status: "to_process"
    };

    await collection.insertOne(newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
});

app.patch("/api/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const database = client.db("ben_jerrys");
    const collection = database.collection("orders");

    const result = await collection.updateOne(
      { id: id },
      { $set: { status: req.body.status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const updatedOrder = await collection.findOne({ id: id });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
      error: error.message
    });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const database = client.db("ben_jerrys");
    const collection = database.collection("orders");

    const order = await collection.findOne({ id: id });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    await collection.deleteOne({ id: id });

    res.json({
      message: "Order deleted",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
      error: error.message
    });
  }
});

async function startServer() {
  try {
    await client.connect();

    console.log("Connected to MongoDB 🍦");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

startServer();