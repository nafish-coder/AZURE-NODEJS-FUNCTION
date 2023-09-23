const  MongoClient  = require("mongodb").MongoClient;

const url = process.env.MONGODB_ATLAS_URI; // Replace with your MongoDB server URL
const dbName = process.env.MONGODB_ATLAS_DATABASE; // Replace with your database name

async function connectToMongoDB() {
  const url = process.env.MONGODB_ATLAS_URI; // Replace with your MongoDB server URL
  const dbName = process.env.MONGODB_ATLAS_DATABASE; // Replace with your database name

  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  return db;
}

module.exports = connectToMongoDB;
