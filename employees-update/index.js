const { extractUserFromToken } = require("../uservalidate");
const connectToMongoDB = require("../Dbconfig");
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
      context.res = {
        status: 401,
        body: "Unauthorized: Invalid token",
      };
      return;
    }

    // Connect to MongoDB
    const db = await connectToMongoDB();
    const collection = db.collection(process.env.MONGODB_ATLAS_COLLECTION);

    // Update operation
    // Assuming req.body contains the updated data
    const emp_no = parseInt(req.query.emp_no);
    const updatedItem = { ...req.body, emp_no: emp_no }; // Assuming req.body contains the updated data
    const filter = { emp_no: updatedItem.emp_no }; // Assuming you are updating by emp_no
    const { error } = updateSchema.validate(updatedItem);

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
      const result = await collection.replaceOne(filter, updatedItem);

      if (result.modifiedCount === 0) {
        context.res = {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            message: "Record not found",
          },
        };
      } else {
        context.res = {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            message: "Record updated successfully",
            data: updatedItem,
          },
        };
      }
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
  }
};