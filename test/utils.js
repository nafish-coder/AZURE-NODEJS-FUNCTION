const MongoClient = require("mongodb").MongoClient;

const utils = async function() {
  try {
    const mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connect to the database
    await mongoClient.connect();

    const database = mongoClient.db(process.env.MONGODB_ATLAS_DATABASE);
    const collection = database.collection(process.env.MONGODB_ATLAS_COLLECTION1);

    // Fetch data from the collection
    const data = await collection.find({}).toArray();

    // Close the database connection
    mongoClient.close();

    if (data.length > 0) {
      console.log(data[0].token);
      return data[0].token;
    } else {
      console.log("No data found in the collection.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
};

module.exports = utils;
