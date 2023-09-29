const { extractUserFromToken } = require("../validate-token/uservalidate");
const connectToMongoDB = require("../database-config/Dbconfig");

module.exports = async function (context, req) {
  try {
    // Extract user from the token
    const user = extractUserFromToken(req, process.env.secretKey);
    context.log(  "valid token user ",user)
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

    const emp_no = parseInt(req.query.emp_no);

    // Validate the input data (emp_no ID)
    if (!emp_no) {
    context.log("emp_no not provided in the query", emp_no);
      context.res = {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          message: "emp_no (id) not provided in the query",
        },
      };
      return;
    }

    // Attempt to delete the specified record
    const result = await collection.deleteOne({ emp_no: emp_no });
    if (result.deletedCount === 0) {
    context.log("status: 404 ,Record not found", emp_no);
      context.res = {
        status: 404, // Not Found
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          message: "Record not found",
          result,
        },
      };
    } else {
      context.log(" status: 200, Item deleted successfully ", emp_no);
      context.res = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          message: "Item deleted successfully ",
          emp_no,
          data: result.deletedCount,
        },
      };
    }
  } catch (error) {
  context.log("An error occurred while processing your request. ");
    context.res = {
      status: 500, // Internal Server Error
      body: {
        message: "An error occurred while processing your request.",
        error: error.message,
      },
    };
  }
};
