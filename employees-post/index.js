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
    context.log("validated user",user)
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
    context.log(  "status:","400",error.details[0].message)
      return (context.res = {
        status: 400,
        body: { message: error.details[0].message },
      });
    }
else{
     await collection.insertOne(insertedBody);
    
     context.log(  "status:","200","insertedBody ",insertedBody)
    context.res = {
      status: 200,
      body: { message: "Item updated or inserted successfully", insertedBody },
    };
}
    
   
  } catch (error) {
  context.log(  "status:","500","Internal Server Error")
    context.res = {
      status: 500,
      body: { message: "Internal Server Error" },
    };
  }
};
