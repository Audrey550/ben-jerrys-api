require("dotenv").config();

const { MongoClient } = require("mongodb");
const orders = require("./data/orders");

const client = new MongoClient(process.env.MONGODB_URI);

async function seedDatabase() {
  try {
    await client.connect();

    const database = client.db("ben_jerrys");
    const collection = database.collection("orders");

    await collection.deleteMany({});
    await collection.insertMany(orders);

    console.log("Orders added to MongoDB 🍦");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();