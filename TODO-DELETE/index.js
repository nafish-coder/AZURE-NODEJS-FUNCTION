const MongoClient = require("mongodb").MongoClient;
const Joi = require("joi");
const jwt = require("jsonwebtoken");
module.exports = async function (context, req) {
  
  const mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI);
  const database = await mongoClient.connect(); 

    // Ensure that a valid JWT token is provided in the request header
    const collection = database
     .db(process.env.MONGODB_ATLAS_DATABASE)
     .collection(process.env.MONGODB_ATLAS_COLLECTION); 
       const authHeader =req.headers['authorization']
console.log("authHeader",authHeader)
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
      return decoded;
    } catch (error) {
      // Log the error for debugging purposes

  
      // If the token verification fails, return null or handle the error gracefully
      return null;
    }
  };
  
  // Call the verifyToken function with the token
  const user = verifyToken(token);
  console.log("user -verifed by (token)",user)
  console.log("user -verifed by (token)",user)
  if (!user) {
    context.res = {
      status: 401,
      body: "Unauthorized: Invalid token",
    };
    return;
  }

    const emp_no = parseInt(req.query.emp_no);

    // Validate the input data (emp_no ID)
    if (!emp_no) {
      console.log("emp_no not provided in the query",emp_no)
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
      console.log("Record not found",emp_no)
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
      console.log("Item deleted successfully ",emp_no) 
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
  
   
};
