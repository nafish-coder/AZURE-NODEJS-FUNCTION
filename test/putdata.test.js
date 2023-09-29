const azureFunction = require("../employees-update/index");
const config = require("../local.settings.json");
const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NTI4MTMxOSwiZXhwIjoxNzI2ODM4OTE5fQ.SuDdge1Pq6-KfCdeiFBjx8zReXWSTmObgrkOH5xekXc"
const Ajv = require('ajv');
const ajv = new Ajv();
var schema = {
  type: "object",
  properties: {
    message: {
      type: "string"
    },
    data: {
      type: "object",
      properties: {
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
        },
        emp_no: {
          type: "number"
        }
      },
      required: ["birth_date", "first_name", "last_name", "gender", "hire_date", "emp_no"]
    }
  },
  required: ["message", "data"]
};
describe("Azure Function Tests -Insert/put data", () => {
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
       log: jest.fn(),
error:jest.fn(),
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

            };

    await azureFunction(context, req);
  
    
    expect(context.res.status).toBe(401); 
  }, 50000);
 
  it("should update a record successfully and return a 200 status code", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: {emp_no:7},
      body: {
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ashu",
        last_name: "kumar",
        gender: "M",
        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };
    req.headers = {
      authorization:token,
    };

    await azureFunction(context, req);

    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(true);
   
    expect(context.res.status).toBe(200); // Adjust status code as needed
    expect(context.res.body.message).toBe("Record updated successfully");

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("should return a 'Record not found' message with a 404 status code", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no:"0"},
      body: {
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "azim",
        last_name: "alam",
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
   // Adjust status code as needed
    expect(context.res.status).toBe(404); // Adjust status code as needed
    expect(context.res.body.message).toBe("Record not found");

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : gender should be required", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: "5" },
      body: {
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ashu",
        last_name: "kumar",

        hire_date: "2023-10-19T18:30:00.000Z",
      },
    };

    req.headers = {
      authorization:token,
    };

    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const isValid = validate(context.res.body);
    expect(isValid).toBe(false);
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"gender" is required');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : gender should be either 'M' or 'F'", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: " 5" },
      body: {
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
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"gender" must be one of [M, F]');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : first_name should required", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: " 5" },
      body: {
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
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"first_name" is required');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : first_name should be a string", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: " 5" },
      body: {
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
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"first_name" must be a string');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : last_name should required", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: " 5" },
      body: {
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
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"last_name" is required');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : last_name should be a string", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: " 5" },
      body: {
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
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"last_name" must be a string');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : hire_date is required", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: " 5" },
      body: {
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
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"hire_date" is required');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : birth_date is required", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: " 5" },
      body: {
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
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"birth_date" is required');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("VALIDATION : emp_no quary should be a non-empty number", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {
      query: { emp_no: "" },
      body: {
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "ASLU",
        last_name: "KUMAR",
        gender: "M",
        hire_date: "",
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
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(400); // Adjust status code as needed
    expect(context.res.body.message).toBe('"emp_no" must be a number');

    // Add more assertions as needed based on your function's behavior
  }, 50000);
  it("handles error when no data is given in the request 500 status code", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
res: {},
    };

    const req = {};

    await azureFunction(context, req);


    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(500); // Adjust status code as needed
    expect(context.res.body.message).toBe(
      "Error: No data found in the request"
    );

    // Add more assertions as needed based on your function's behavior
  }, 50000);
   it("Unauthorized: invalid token user not found", async () => {
    const context = {
       log: jest.fn(),
error:jest.fn(),
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
     
      };

    await azureFunction(context, req);

    
    expect(context.res.status).toBe(401); 
  }, 50000);
});
