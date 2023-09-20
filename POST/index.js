const MongoClient = require("mongodb").MongoClient;
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const updateSchema = Joi.object({
  emp_no: Joi.number().integer().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  birth_date: Joi.date().iso().required(),
  gender: Joi.string().valid("M", "F").required(),
  hire_date: Joi.date().iso().required(),
});

module.exports = async function (context, req) {
  const mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI);
  const database = await mongoClient.connect();
  try {
    const collection = database
      .db(process.env.MONGODB_ATLAS_DATABASE)
      .collection(process.env.MONGODB_ATLAS_COLLECTION);

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      context.res = {
        status: 401,
        body: "Unauthorized: Missing or invalid token",
      };
      return;
    }

    // Extract and verify the JWT token
    const token = authHeader.split(" ")[1];
    // Verify the token
    const verifyToken = (token) => {
      try {
        // Verify the JWT token using a secret or public key
        const decoded = jwt.verify(token, process.env.secretKey);
        console.log(decoded);
        return decoded;
      } catch (error) {
        // If the token verification fails, return null or throw an error
        return  null;
      }
    };

    // Call the verifyToken function with the token
    const user = verifyToken(token);

    if (!user) {
      context.res = {
        status: 401,
        body: "Unauthorized: Invalid token",
      };
      return;
    }

    // Assuming req.body contains the data for the new item
    const insertedbody = req.body;

    // Find the last person's emp_no and increment it by 1

    const lastPerson = await collection.findOne({}, { sort: { emp_no: -1 } });
    if (lastPerson) {
      insertedbody.emp_no = lastPerson.emp_no + 1;
    } else {
      insertedbody.emp_no = 1;
    }
    const { error } = updateSchema.validate(insertedbody);
    if (error) {
      context.res = {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          message: error.details[0].message,
        },
      };
      return;
    } else {
      const result = await collection.insertOne(insertedbody);
      context.res = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          message: "Item created successfully",
          data: result,
        },
      };
    }
  } catch (error) {
    context.res = {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        message: "Error: No data found in the request",
      },
    };
  } finally {
    await mongoClient.close();
  }
};
