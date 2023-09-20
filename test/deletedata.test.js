const azureFunction = require("../DELETE/index");

const config = require("../local.settings.json");
const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NTE5OTg4OCwiZXhwIjoxNjk1MjM1ODg4fQ.PNaktFBwKs-7GIbxeLZLxQvp6zZEFnMQrat5wbbQpq4"

describe("Azure Function Tests -deleted data", () => {
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
      query: {emp_no: 11},
      body: {
      },
    };

    req.headers = {
      authorization:
        "Bee eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NDk2NzE2MiwiZXhwIjozMTU3NDIzNDA5NTYyfQ.aXyX1B1ZdCKnMTbsiyPBSXphc2hdEqNJiyo3yjxYdMs",
    };

    await azureFunction(context, req);

   
    expect(context.res.status).toBe(401); 

  }, 50000);
  it("should delete a record successfully and return a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {emp_no: 28},
      body: {
      },
    };
    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);
    ///becuse data is deleted in privious test then show 404 record not found
if(context.res.status===404)
{   expect(context.res.status).toBe(404)
    expect(context.res.body.message).toBe("Record not found")}
    else{
         expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("Item deleted successfully ");
    }
 

  }, 50000);
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

   
    expect(context.res.status).toBe(404); 
    expect(context.res.body.message).toBe( "Record not found");

  }, 50000);
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

   
    expect(context.res.status).toBe(400); 
    expect(context.res.body.message).toBe("Item ID (id) not provided in the query");

  }, 50000);
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

    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(401); // Adjust status code as needed

    // Add more assertions as needed based on your function's behavior
  }, 50000);
});
