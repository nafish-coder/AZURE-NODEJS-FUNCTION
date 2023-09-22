Serverless Bot
===================================================================


This guide will help you set up and run a Serverless Chatbot for Rezo written in Java using Visual Studio Code, Gradle, and the Azure Functions extension. You will learn how to deploy and test your Azure Functions locally using the azureFunctionsDeploy and azureFunctionsRun tasks provided by the Gradle plugin.

Step-by-step user guide [video](https://drive.google.com/file/d/1x9IS2DblxwA_0w1nplqExBxnYjB929Sm/view?usp=drive_link).


Prerequisites
-------------

Before you begin, make sure you have the following prerequisites installed:

Since we are building the NodeJS REST API application you need to be familiar with nodejs, and javascript.
You need to install NodeJS on your local machine.some other 
•	[NodeJS](https://nodejs.org/en)
•	[Javascript](https://code.visualstudio.com/Docs/languages/javascript)
•	[mongodb](https://www.mongodb.com/)
•	[jest](https://jestjs.io/) for testing
•	VSCode: The editor we are using for the project.[It’s open-source and you can download it here](https://code.visualstudio.com/).


Getting Started
---------------

Follow these steps to set up and run your Azure Function locally using Visual Studio Code and Gradle:
  
 ###Step 1: Clone this `Repository
 
   •"Please ensure that the 'package.json' and 'package-lock.json' files are present inside the folder. If they are not present, please create them and copy the data from the corresponding files on GitHub. This is important because sometimes, when cloning the repository, there may be compatible filenames errors due to the filenames of these files."
  
    git config hooks.enforcecompatiblefilenames true 
    git clone https://github.com/nafish-coder/AZURE-NODEJS-FUNCTION
           cd AZURE-NODEJS-FUNCTION
`
    
### Step 2: Deploy and Run Azure Functions Locally

1.  In the terminal, run the following command to deploy and run your Azure Functions locally:
    
  1- install dependencies
   `npm install`
   
  2- start the server in development phase
   `npm start` or `func start`
    
2.  You'll see output indicating that your functions are being compiled and the local Functions runtime is starting.
    
3.  Once the runtime is ready, you'll see a URL like `Functions:

       ` Functions:

        JWTTOKEN: [GET] http://localhost:7071/api/JWTTOKEN

        TODO-DELETE: [DELETE] http://localhost:7071/api/TODO-DELETE

        TODO-GET: [GET] http://localhost:7071/api/TODO-GET

        TODO-POST: [POST] http://localhost:7071/api/TODO-POST

        TODO-UPDATE: [PUT] http://localhost:7071/api/TODO-UPDATE`
        
    where you can access your deployed functions.
4. Use these commands to test the Azure functions:

      ` npm test `

    

### Step 3: Deploy to Azure

1.  Make sure you have an Azure account and are logged in using the Azure CLI.
    
2.  In the terminal, run the following command to deploy your Azure Functions to Azure:
    
    `func azure functionapp publish FuncRestApiNODEJS` 
    
3.  Once the deployment is complete, you'll receive a URL where you can access your deployed functions in the cloud.

Resources
---------

* [Azure Functions javascrpit developer guide](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=javascript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v3)
* [Azure Functions  Samples](https://github.com/Azure-Samples/azure-functions-java-samples)
* [Gradle Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference?tabs=blob&pivots=programming-language-javascript)
* [Azure CLI Documentation](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)

License
-------

This project is licensed under the [MIT License](LICENSE).



 
