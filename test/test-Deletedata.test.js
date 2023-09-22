const azureFunction = require("../DELETE/index");
const config = require("../local.settings.json");
const Ajv = require('ajv');
const ajv = new Ajv();
const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NDk2NzE2MiwiZXhwIjozMTU3NDIzNDA5NTYyfQ.aXyX1B1ZdCKnMTbsiyPBSXphc2hdEqNJiyo3yjxYdMs"
var schema = {
  type: "object",
  properties: {
    message: {
      type: "string"
    },
    emp_no: {
      type: "number"
    },
    data: {
      type: "number"
    }
  },
  required: ["message", "emp_no", "data"]
};

describe("Azure Function Tests -deleted data", () => {
  beforeAll(() => {
    process.env = Object.assign(process.env, {
      MONGODB_ATLAS_URI: config.Values.MONGODB_ATLAS_URI,
      MONGODB_ATLAS_CLUSTER: config.Values.MONGODB_ATLAS_CLUSTER,
      MONGODB_ATLAS_DATABASE: config.Values.MONGODB_ATLAS_DATABASE,
      MONGODB_ATLAS_COLLECTION: config.Values.MONGODB_ATLAS_COLLECTION,
     
      secretKey: config.Values.secretKey,
      MONGODB_ATLAS_COLLECTION1: config.Values.MONGODB_ATLAS_COLLECTION1,
    });
  });
 
  it("Unauthorized: Missing or invalid token", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {emp_no: 11},
      body: {
      },
    };

    req.headers = {
      authorization:
        "Bee eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NDk2NzE2MiwiZXhwIjozMTU3NDIzNDA5NTYyfQ.aXyX1B1ZdCKnMTbsiyPBSXphc2hdEqNJiyo3yjxYdMs",
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const valid = validate(context.res.body);
  
    // Use Jest assertions to check if the validation passed
    expect(valid).toBe(false);
   
    expect(context.res.status).toEqual(401); 

  }, 10000);
  it("should delete a record successfully, show test fail when trying the same emp_no again so change quary test again , and return a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {emp_no:30},
      body: {
      },
    };
    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
   
      const validate = ajv.compile(schema);
      const valid = validate(context.res.body);
    
      // Use Jest assertions to check if the validation passed
      expect(valid).toBe(true);
         expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("Item deleted successfully ");
    
  }, 10000);
  it("should delete emp_id  not found and return a 404 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {emp_no: 8},
      body: {
      },
    };
    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const valid = validate(context.res.body);
  
    // Use Jest assertions to check if the validation passed
    expect(valid).toBe(false);
   
    expect(context.res.status).toBe(404); 
    expect(context.res.body.message).toBe( "Record not found");

  }, 10000);
  it("should Item ID (emp_no) not provided in the query", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
      },
    };
    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const valid = validate(context.res.body);
  
    // Use Jest assertions to check if the validation passed
    expect(valid).toBe(false);
   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe("emp_no (id) not provided in the query");

  }, 10000);
   it("Unauthorized: invalid token user not found", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: { emp_no: "20" },
      body: {
       
      },
    };

    req.headers = {
      authorization:
        "Bearer e122yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NDk2NzE2MiwiZXhwIjozMTU3NDIzNDA5NTYyfQ.aXyX1B1ZdCKnMTbsiyPBSXphc2hdEqNJiyo3yjxYdMs",
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const valid = validate(context.res.body);
  
    // Use Jest assertions to check if the validation passed
    expect(valid).toBe(false);
    
    expect(context.res.status).toBe(401); 

    
  }, 10000);
 
});
