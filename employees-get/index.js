const { extractUserFromToken } = require("../validate-token/uservalidate");
const connectToMongoDB = require("../database-config/Dbconfig");

module.exports = async function (context, req) {
  try {
    // Extract user from the token
    const user = extractUserFromToken(req, process.env.secretKey);
context.log("validated user",user)
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

    // Querying Options
    const queryOptions = {};

    // Filtering
    const filterParam = req.query.filter;
    if (filterParam) {
      const filterParts = filterParam.split(":");
      if (filterParts.length !== 2) {
        return handleBadRequest(context, "Invalid filter parameter format. Use 'filter=fieldName:value'");
      }
      const [field, value] = filterParts;
      if (field=="emp_no")
      queryOptions[field] =parseInt(value);
    else
      queryOptions[field] = value;
      
    }

    // Sorting
    const sortParam = req.query.sort;
    const sort = {};
    if (sortParam) {
      const sortParts = sortParam.split(":");
      if (sortParts.length !== 2 || (sortParts[1] !== "asc" && sortParts[1] !== "desc")) {
        return handleBadRequest(context, "Invalid sort parameter format. Use 'sort=fieldName:asc' or 'sort=fieldName:desc'");
      }
      sort[sortParts[0]] = sortParts[1] === "asc" ? 1 : -1;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
     
    context.log("queryOptions",queryOptions)
    context.log("sort",sort)
    // Read operation with querying options
    const results = await collection
      .find(queryOptions)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .toArray();
      context.log("data",results)
    context.res = {
      
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        page,
        pageSize:results.length,
        StartIndex: skip,
        data: results,
        message: "retrieve data from the database table using a GET request",
      },
    };
  } catch (error) {
    context.error( "Can't retrieve data from the database table using a GET request // database error")
    context.res = {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        message: "Can't retrieve data from the database table using a GET request",
      },
    };
  }
};

function handleBadRequest(context, message) {
  context.res = {
    status: 400,
    body: {
      message,
    },
  };
}
