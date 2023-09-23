const { extractUserFromToken } = require("../validate-token/uservalidate");
const connectToMongoDB = require("../database-config/Dbconfig");
const Joi = require("joi");

const updateSchema = Joi.object({
  emp_no: Joi.number().integer().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  birth_date: Joi.date().iso().required(),
  gender: Joi.string().valid("M", "F").required(),
  hire_date: Joi.date().iso().required(),
});

module.exports = async function (context, req) {
  try {
    const user = extractUserFromToken(req, process.env.secretKey);

    if (!user) {
      return (context.res = {
        status: 401,
        body: "Unauthorized: Invalid token",
      });
    }

    const db = await connectToMongoDB();
    const collection = db.collection(process.env.MONGODB_ATLAS_COLLECTION);

    const insertedBody = req.body;
    const { error } = updateSchema.validate(insertedBody);

    if (error) {
      return (context.res = {
        status: 400,
        body: { message: error.details[0].message },
      });
    }

    const existingDocument = await collection.findOne({ emp_no: insertedBody.emp_no });

    if (existingDocument) {
      await collection.updateOne({ emp_no: insertedBody.emp_no }, { $set: insertedBody });
    } else {
      await collection.insertOne(insertedBody);
    }

    context.res = {
      status: 200,
      body: { message: "Item updated or inserted successfully", insertedBody },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { message: "Internal Server Error" },
    };
  }
};
