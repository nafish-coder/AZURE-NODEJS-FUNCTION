const azureFunction = require("../POST/index");

const config = require("../local.settings.json");
const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NTE5OTg4OCwiZXhwIjoxNjk1MjM1ODg4fQ.PNaktFBwKs-7GIbxeLZLxQvp6zZEFnMQrat5wbbQpq4"

describe("Azure Function Tests -POST data", () => {
  beforeAll(() => {
    process.env = Object.assign(process.env, {
      MONGODB_ATLAS_URI: config.Values.MONGODB_ATLAS_URI,
      MONGODB_ATLAS_CLUSTER: config.Values.MONGODB_ATLAS_CLUSTER,
      MONGODB_ATLAS_DATABASE: config.Values.MONGODB_ATLAS_DATABASE,
      MONGODB_ATLAS_COLLECTION: config.Values.MONGODB_ATLAS_COLLECTION,
      FUNCTIONS_WORKER_RUNTIME: config.Values.FUNCTIONS_WORKER_RUNTIME,
      AzureWebJobsStorage: config.Values.AzureWebJobsStorage,
      APPINSIGHTS_INSTRUMENTATIONKEY:config.Values.APPINSIGHTS_INSTRUMENTATIONKEY,
      FUNCTIONS_EXTENSION_VERSION: config.Values.FUNCTIONS_EXTENSION_VERSION,
      WEBSITE_CONTENTAZUREFILECONNECTIONSTRING:config.Values.WEBSITE_CONTENTAZUREFILECONNECTIONSTRING,
      WEBSITE_CONTENTSHARE: config.Values.WEBSITE_CONTENTSHARE,
      WEBSITE_NODE_DEFAULT_VERSION: config.Values.WEBSITE_NODE_DEFAULT_VERSION,
      secretKey: config.Values.secretKey,
      MONGODB_ATLAS_COLLECTION1: config.Values.MONGODB_ATLAS_COLLECTION1,
    });
  });

  it("Unauthorized: Missing or invalid token", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
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
        "Bee eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NDk2NzE2MiwiZXhwIjozMTU3NDIzNDA5NTYyfQ.aXyX1B1ZdCKnMTbsiyPBSXphc2hdEqNJiyo3yjxYdMs",
    };

    await azureFunction(context, req);

   
    expect(context.res.status).toBe(401); 

  }, 50000);
  
  it("should create a record successfully and return a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        birth_date: "2000-02-27T18:30:00.000Z",
        first_name: "naf",
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

   
    expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("Item created successfully");

  }, 50000);
  it("VALIDATION : gender should be required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"gender" is required');

  }, 50000);
  it("VALIDATION : gender should be either 'M' or 'F'", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"gender" must be one of [M, F]');

  }, 50000);
  it("VALIDATION : first_name should required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"first_name" is required');

  }, 50000);
  it("VALIDATION : first_name should be a string", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"first_name" must be a string');

  }, 50000);
  it("VALIDATION : last_name should required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"last_name" is required');

  }, 50000);
  it("VALIDATION : last_name should be a string", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"last_name" must be a string');

  }, 50000);
  it("VALIDATION : hire_date is required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"hire_date" is required');

  }, 50000);
 
  it("VALIDATION : birth_date is required", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe('"birth_date" is required');

  }, 50000);
  
  it("handles error when no data is given in the request 500 status code", async () => {
    const context = {
      res: {},
    };

    const req = {};

    await azureFunction(context, req);

   
    expect(context.res.status).toBe(500); 
    expect(context.res.body.message).toBe(
      "Error: No data found in the request"
    );

  }, 50000);
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

    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(401); // Adjust status code as needed

    // Add more assertions as needed based on your function's behavior
  }, 50000);
});
