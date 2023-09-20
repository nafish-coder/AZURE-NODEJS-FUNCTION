const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

module.exports = async function (context, req) {
  const secretKey ="jwt-token";
  const mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI);
  const payload = {
    username: "nafish",
    role: "admin@test.com",
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: "1 year" });

  const database = await mongoClient.connect();

  const collection = database
    .db(process.env.MONGODB_ATLAS_DATABASE)
    .collection(process.env.MONGODB_ATLAS_COLLECTION1);
  const documentId = "650835e27d2a79bfb5d075ea";
  const filter = { _id: new ObjectId(documentId) };
  const updateDocument = { $set: { token: token } };
  await collection.updateOne(filter, updateDocument);
  context.res = {
    body: { token },
  };
};
