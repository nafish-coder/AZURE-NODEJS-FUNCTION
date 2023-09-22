const azureFunction = require("../TODO-GET/index");
const Ajv = require('ajv');
const config = require("../local.settings.json");
const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZmlzaCIsInJvbGUiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTY5NTI4MTMxOSwiZXhwIjoxNzI2ODM4OTE5fQ.SuDdge1Pq6-KfCdeiFBjx8zReXWSTmObgrkOH5xekXc"
var schema = {
  type: "object",
  properties: {
    page: {
      type: "number"
    },
    pageSize: {
      type: "number"
    },
    StartIndex: {
      type: "number"
    },
    data: {
      type: "array",
      items: {
        type: "object"
      },
    },
    message: {
      type: "string"
    }
  },
  required: ["page", "pageSize", "StartIndex", "data", "message"],
};
const ajv = new Ajv();
describe("Azure Function Tests -GET data", () => {
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
    expect(context.res.status).toBe(401); 

  }, 15000);
  it("should retrieve data from the database table using a GET request and return a 200 status code", async () => {
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
    expect(valid).toBe(true);
    expect(context.res.body.message).toBe("retrieve data from the database table using a GET request");
  }, 15000);
  it("should filter  data from the database table using a GET request A/c query and return a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {filter:"gender:M"},
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
    expect(context.res.body.page).toBe(1);
    expect(context.res.body.StartIndex).toBe(0);
    expect(context.res.body.pageSize).toBe(10);
    expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("retrieve data from the database table using a GET request");

  }, 15000);
  it("should filter  data from the database table using a GET request A/c inappropriate query (error handle)  and return a 404 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {filter:"ff"},
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
    expect(context.res.body.message).toBe("Invalid filter parameter format. Use 'filter=fieldName:value'");

  }, 15000);
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
    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const valid = validate(context.res.body);
  
    // Use Jest assertions to check if the validation passed
    expect(valid).toBe(false);
  
    // Add assertions to test the behavior of your Azure Function
    expect(context.res.status).toBe(401); // Adjust status code as needed

    // Add more assertions as needed based on your function's behavior
  }, 15000);
  it("Sorting data in descending order from a database table using a GET request and returning a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {sort:"emp_no:desc"},
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
    expect(context.res.body.page).toBe(1);
    expect(context.res.body.StartIndex).toBe(0);
    expect(context.res.body.pageSize).toBe(10); 
    expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("retrieve data from the database table using a GET request");

  }, 15000);
  it("Sorting data in descending order ,page=2 and returning a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {sort:"emp_no:desc",page:2},
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
    expect(context.res.body.page).toBe(2);
    expect(context.res.body.StartIndex).toBe(10);
    expect(context.res.body.pageSize).toBe(10); 
    expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("retrieve data from the database table using a GET request");

  }, 15000);
  it("Sorting data in ascending order from a database table using a GET request and returning a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {sort:"emp_no:asc"},
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
    expect(context.res.body.page).toBe(1);
    expect(context.res.body.StartIndex).toBe(0);
    expect(context.res.body.pageSize).toBe(10); 
    expect(context.res.status).toBe(200); 
    expect(context.res.body.message).toBe("retrieve data from the database table using a GET request");

  }, 15000);
  it("Sorting data from the database table using a GET request A/c inappropriate query (error handle)  and return a 404 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {sort:"ff"},
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
    expect(context.res.body).toBe("Invalid sort parameter format. Use sort=fieldName:asc or ?sort=fieldName:desc");

  }, 15000);
  it("pagination in  database table using a GET request and returning a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {page:1},
      body: {
        
      },
    };
    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);

   
    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const valid = validate(context.res.body);
  
    // Use Jest assertions to check if the validation passed
    expect(valid).toBe(true);
   
    expect(context.res.status).toBe(200); 
  
    expect(context.res.body.StartIndex).toBe(0);
    expect(context.res.body.pageSize).toBe(10); 
    expect(context.res.body.page).toBe(1);
    expect(context.res.body.message).toBe("retrieve data from the database table using a GET request");
   

  }, 15000);
  it("pagination page =2 in  database table using a GET request and returning a 200 status code", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {page:2},
      body: {
        
      },
    };
    req.headers = {
      authorization:
        token,
    };

    await azureFunction(context, req);

   
    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const valid = validate(context.res.body);
  
    // Use Jest assertions to check if the validation passed
    expect(valid).toBe(true);
   
    expect(context.res.status).toBe(200); 
    expect(context.res.body.page).toBe(2);
    expect(context.res.body.StartIndex).toBe(10);
    expect(context.res.body.pageSize).toBe(10);
    expect(context.res.body.message).toBe("retrieve data from the database table using a GET request");
   

  }, 15000);
  it("can't retrieve data from the database table using a GET request", async () => {
    const context = {
      res: {},
    };

    const req = {
      query: {},
      body: {
        
      },
    };
   
   
    await azureFunction(context, req);
    const validate = ajv.compile(schema);
    const valid = validate(context.res.body);
  
    // Use Jest assertions to check if the validation passed
    expect(valid).toBe(false);
   
   
    expect(context.res.status).toBe(500); 
    expect(context.res.body.message).toBe("can't retrieve data from the database table using a GET request");

  }, 15000);
  
});
