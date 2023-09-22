const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

 
module.exports = async function (context, req) {

  const mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI);
  const database = await mongoClient.connect(); 
  try {
    // Ensure that a valid JWT token is provided in the request header
    const collection = database
     .db(process.env.MONGODB_ATLAS_DATABASE)
     .collection(process.env.MONGODB_ATLAS_COLLECTION); 
       const authHeader =req.headers['authorization']


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
  console.log(`User provide a valid token in the request header to access the APIs. `,decoded)
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

  

    // Querying Options
    const queryOptions = {};

    // Filtering
    if (req.query.filter) {
      const filterParam = req.query.filter;
      const filterParts = filterParam.split(":");
      
      // Check if the filter parameter has exactly two parts separated by ":"
      if (filterParts.length !== 2) {
        context.res = {
          status: 400, // Bad Request
          body:{message:"Invalid filter parameter format. Use 'filter=fieldName:value'"},
        };
        return;
      }
      const [field, value] = filterParts;
      queryOptions[field] = value;
      
    } 

    // Sorting
    if (req.query.sort) {
      // Assuming you pass a sort parameter in the query like "?sort=fieldName:asc" or "?sort=fieldName:desc"
      const sortParts = req.query.sort.split(":");
   var sort = {}; 
   
      
      
       if (sortParts.length !== 2) {
        context.res = {
          status: 400, // Bad Request
          body: "Invalid sort parameter format. Use sort=fieldName:asc or ?sort=fieldName:desc",
        };
        return;
      }
      const [field, order] = sortParts;
      sort[field] = order == "asc" ? 1 : -1; 
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
 console.log("queryOptions",queryOptions)
 console.log("sort",sort)
    // Read operation with querying options
    const results = await collection
      .find(queryOptions)
      .sort(sort) // Apply sorting
      .skip(skip) // Apply skipping
      .limit(pageSize) // Apply limiting
      .toArray();
    console.log("Results:", results.length);
   
      context.res = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body:{ page : page,
           pageSize : pageSize,
           StartIndex : skip,
          data:results,message:"retrieve data from the database table using a GET request" },
      };
    
  } catch (error) {
    context.res = {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        message:"can't retrieve data from the database table using a GET request",
      },
    };
  } finally {
    await mongoClient.close();
  }
};
