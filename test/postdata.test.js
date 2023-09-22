const azureFunction = require("../TODO-POST/index");
const Ajv = require('ajv');
const config = require("../local.settings.json");
const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NTI4MTMxOSwiZXhwIjoxNzI2ODM4OTE5fQ.SuDdge1Pq6-KfCdeiFBjx8zReXWSTmObgrkOH5xekXc"
var schema = {
  type: "object",
  properties: {
    message: {
      type: "string"
    },
    insertedBody: {
      type: "object",
      properties: {
        emp_no: {
          type: "number"
        },
        birth_date: {
          type: "string"
        },
        first_name: {
          type: "string"
        },
        last_name: {
          type: "string"
        },
        gender: {
          type: "string"
        },
        hire_date: {
          type: "string"
        }
      },
      required: ["emp_no", "birth_date", "first_name", "last_name", "gender", "hire_date"]
    }
  },
  required: ["message", "insertedBody"]
};
const ajv = new Ajv();
describe("Azure Function Tests -POST data", () => {
  beforeAll(() => {
    process.env = Object.assign(process.env, {
      MONGODB_ATLAS_URI: config.Values.MONGODB_ATLAS_URI,
      MONGODB_ATLAS_CLUSTER: config.Values.MONGODB_ATLAS_CLUSTER,
      MONGODB_ATLAS_DATABASE: config.Values.MONGODB_ATLAS_DATABASE,
      MONGODB_ATLAS_COLLECTION: config.Values.MONGODB_ATLAS_COLLECTION,
      MONGODB_ATLAS_COLLECTION1: config.Values.MONGODB_ATLAS_COLLECTION1,
      secretKey: config.Values.secretKey,
    });
  });

  it("Unauthorized: Missing or invalid token", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ashu",
        last_name: "kumar",
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        "Bee eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NDk2NzE2MiwiZXhwIjozMTU3NDIzNDA5NTYyfQ.aXyX1B1ZdCKnMTbsiyPBSXphc2hdEqNJiyo3yjxYdMs",
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(401); 

  }, 10000);
  
  it("should create a record successfully and return a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:42,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "NAFISH",
        last_name: "SHEIKH",
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };
    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(true);
    expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("Item updated successfully");
    expect(context.res.body.insertedBody).toBe(req.body);

  }, 10000);
  it("should update if emp_no is exist then record updated record successfully and return a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:67,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "Md nafish",
        last_name: "Alam",
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };
    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(true);
    expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("Item updated successfully");
    expect(context.res.body.insertedBody).toBe(req.body);
  }, 10000);
  it("VALIDATION : gender should be required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ashu",
        last_name: "kumar",

        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"gender" is required');

  }, 10000);
  it("VALIDATION : gender should be either 'M' or 'F'", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ashu",
        last_name: "kumar",
        gender: "K",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"gender" must be one of [M, F]');

  }, 10000);
  it("VALIDATION : first_name should required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        birth_date: "2000-02-27T18:30:00.000Z",
        last_name: "kumar",
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"first_name" is required');

  }, 10000);
  it("VALIDATION : first_name should be a string", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: 12,
        last_name: "kumar",
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);

    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"first_name" must be a string');

  }, 10000);
  it("VALIDATION : last_name should required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "kumar",
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"last_name" is required');

  }, 10000);
  it("VALIDATION : last_name should be a string", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ASLU",
        last_name: 123,
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"last_name" must be a string');

  }, 10000);
  it("VALIDATION : hire_date is required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ASLU",
        last_name: "KUMAR",
        gender: "M",
      },
    };

    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"hire_date" is required');

  }, 10000);
  it("VALIDATION : birth_date is required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        emp_no:25,
        first_name: "ASLU",
        last_name: "KUMAR",
        gender: "M",
        hire_date: "2000-02-27T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"birth_date" is required');

  }, 10000);
  it("handles error when no data is given in the request 500 status code", async () => {
    const context = {
      res: {},
    };

    const req = {};

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
   
    expect(context.res.status).toBe(500); 
    expect(context.res.body.message).toBe(
      "Error: No data found in the request"
    );

  }, 10000);
  it("Unauthorized: invalid token user not found", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: { emp_no: " 5" },
      body: {
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ashu",
        last_name: "kumar",
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:
        "Bearer e122yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NDk2NzE2MiwiZXhwIjozMTU3NDIzNDA5NTYyfQ.aXyX1B1ZdCKnMTbsiyPBSXphc2hdEqNJiyo3yjxYdMs",
    };
    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(401); // Adjust status code as needed

    // Add more assertions as needed based on your function's behavior
  }, 10000);
});
