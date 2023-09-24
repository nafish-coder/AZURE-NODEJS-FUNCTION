

# Azure Function - Serverless 

===================================================================

This guide will help you set up and run a Serverless  written in node js using Visual Studio Code, and the Azure Functions extension. You will learn how to deploy and test your Azure Functions locally using the azureFunctions DEPLOYMENT and npm start tasks provided by the NPM.

[Step-by-step user guide video](https://drive.google.com/u/0/uc?id=1g9vHBlegY60f8PQ9o3PVlX_QW9qk4blW&export=download).

## Prerequisites

Before you begin, make sure you have the following prerequisites installed:

- NodeJS: [Install NodeJS](https://nodejs.org/en)
- JavaScript: [JavaScript Documentation](https://code.visualstudio.com/Docs/languages/javascript)
- MongoDB: [MongoDB](https://www.mongodb.com/)
- Jest for testing: [Jest](https://jestjs.io/)
- VSCode: The editor we are using for the project. [Download VSCode](https://code.visualstudio.com/)

## Getting Started

Follow these steps to set up and run your Azure Function locally using Visual Studio Code and Gradle:

### Step 1: Clone this Repository

Please ensure that the 'package.json' and 'package-lock.json' files are present inside the folder. If they are not present, please create them and copy the data from the corresponding files on GitHub. This is important because sometimes, when cloning the repository, there may be compatible filenames errors due to the filenames of these files.
```bash
git config hooks.enforcecompatiblefilenames true 
git clone https://github.com/nafish-coder/azure-nodejs-function
cd AZURE-NODEJS-FUNCTION
```



### Step 2: Deploy and Run Azure Functions Locally

1. Install dependencies:

```bash
npm install
```

2. Start the server in development phase:

```bash
npm start
# or
func start
```

You'll see output indicating that your functions are being compiled and the local Functions runtime is starting.

Once the runtime is ready, you'll see a URL like:

```text
Functions:

        employees-delete: [DELETE] http://localhost:7071/api/employees-delete

        employees-get: [GET] http://localhost:7071/api/employees-get

        employees-jwttoken: [GET] http://localhost:7071/api/employees-jwttoken

        employees-post: [POST] http://localhost:7071/api/employees-post

        employees-update: [PUT] http://localhost:7071/api/employees-update
```

where you can access your deployed functions.

3. Use this command to test the Azure functions:

```bash
npm test
```

### Step 3: Deploy to Azure

1. Make sure you have an Azure account and are logged in using the Azure CLI.

2. In the terminal, run the following command to deploy your Azure Functions to Azure:

```bash
func azure functionapp publish FuncRestApiNODEJS
```

3. Once the deployment is complete, you'll receive a URL where you can access your deployed functions in the cloud.

## Resources

- [Azure Functions JavaScript Developer Guide](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=javascript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v3)
- [Azure Functions Samples](https://github.com/Azure-Samples/azure-functions-java-samples)
- [user Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference?tabs=blob&pivots=programming-language-javascript)
- [Azure CLI Documentation](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)

## License

This project is licensed under the [MIT License](LICENSE).
```
