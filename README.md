

# Azure Function - Serverless 

===================================================================

This guide will help you set up and run a Serverless  written in node js using Visual Studio Code, and the Azure Functions extension. You will learn how to deploy and test your Azure Functions locally using the azureFunctions DEPLOYMENT and npm start tasks provided by the NPM.

[Step-by-step user guide video](https://drive.google.com/u/0/uc?id=1g9vHBlegY60f8PQ9o3PVlX_QW9qk4blW&export=download).

## Prerequisites

Before you begin, make sure you have the following prerequisites installed:

- NodeJS: [Install NodeJS](https://nodejs.org/en)
- JavaScript: [JavaScript Documentation](https://code.visualstudio.com/Docs/languages/javascript)
- Jest for testing: [Jest](https://jestjs.io/)
- VSCode: The editor we are using for the project. [Download VSCode](https://code.visualstudio.com/)
-A [MongoDB Atlas](https://www.mongodb.com/atlas) database deployed and configured with appropriate network rules and user rules.
-The [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli) installed and configured to use your Azure account.
-The [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-javascript#install-the-azure-functions-core-tools) installed and configured.

## Getting Started

Follow these steps to set up and run your Azure Function locally using Visual Studio Code and Gradle:

### Step 1: Clone this Repository

Please ensure that the 'package.json' and 'package-lock.json' files are present inside the folder. If they are not present, please create them and copy the data from the corresponding files on GitHub. This is important because sometimes, when cloning the repository, there may be compatible filenames errors due to the filenames of these files.
```bash
git config hooks.enforcecompatiblefilenames true 
git clone https://github.com/nafish-coder/azure-nodejs-function
cd azure-nodejs-function
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
The provided instructions guide you through creating an Azure Functions App using the Azure CLI. Below is a step-by-step breakdown of the commands and the process:

i. **Create a Resource Group**:
   Replace `<GROUP_NAME>` with the desired name for your resource group and `<AZURE_REGION>` with the Azure region of your choice. Run the command to create a resource group:

   ```bash
   az group create --name <GROUP_NAME> --location <AZURE_REGION>
   ```

   Example:
   ```bash
   az group create --name MyFunctionAppGroup --location East US
   ```

ii. **Create a Storage Account**:
   Replace `<STORAGE_NAME>`, `<GROUP_NAME>`, and `<AZURE_REGION>` as appropriate. This command creates a storage account, which will be used for function app storage.

   ```bash
   az storage account create --name <STORAGE_NAME> --location <AZURE_REGION> --resource-group <GROUP_NAME> --sku Standard_LRS
   ```

   Example:
   ```bash
   az storage account create --name mystorageaccount --location East US --resource-group MyFunctionAppGroup --sku Standard_LRS
   ```

iii. **Create a Function App**:
   Create the Azure Function App by executing the following command. Replace `<GROUP_NAME>`, `<AZURE_REGION>`, `<APP_NAME>`, and `<STORAGE_NAME>` with appropriate values:

   ```bash
   az functionapp create --resource-group <GROUP_NAME> --consumption-plan-location <AZURE_REGION> --runtime node --functions-version 4 --name <APP_NAME> --storage-account <STORAGE_NAME>
   ```

   Example:
   ```bash
   az functionapp create --resource-group MyFunctionAppGroup --consumption-plan-location East US --runtime node --functions-version 4 --name MyFunctionApp --storage-account mystorageaccount
   ```

   - `--resource-group`: Specifies the resource group you created earlier.
   - `--consumption-plan-location`: Specifies the Azure region.
   - `--runtime`: Specifies the runtime for your functions (in this case, Node.js).
   - `--functions-version`: Specifies the version of Azure Functions to use.
   - `--name`: Specifies the name of your Azure Function App.
   - `--storage-account`: Specifies the storage account created earlier.

iv. With these steps completed, you should now have an Azure Function App configured in the cloud. You can now proceed with writing code for your functions and deploying them to your Azure Function App.

Remember to replace the placeholder values with your actual choices and make sure you have the Azure CLI installed and configured with your Azure account before running these commands.


To deploy an Azure Function with MongoDB support to the cloud, you can follow the provided instructions. Here's a step-by-step breakdown of the commands and the process:

1. **Set Environment Variables**:
   Ensure that your local environment variables, which include MongoDB connection details, are configured to work in the Azure cloud. Use the following Azure CLI commands to set these environment variables. Replace `<FUNCTION_APP_NAME>`, `<RESOURCE_GROUP_NAME>`, `<MONGODB_ATLAS_URI>`, `<MONGODB_ATLAS_DATABASE>`, and `<MONGODB_ATLAS_COLLECTION>` with your actual values:

   ```bash
   az functionapp config appsettings set --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings MONGODB_ATLAS_URI=<MONGODB_ATLAS_URI>
   az functionapp config appsettings set --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings MONGODB_ATLAS_DATABASE=<MONGODB_ATLAS_DATABASE>
   az functionapp config appsettings set --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings MONGODB_ATLAS_COLLECTION=<MONGODB_ATLAS_COLLECTION>
    az functionapp config appsettings set --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings secretKey=<secretKey> for jwt token validate
   ```

   Example:

   ```bash
   az functionapp config appsettings set --name MyFunctionApp --resource-group MyFunctionAppGroup --settings MONGODB_ATLAS_URI="YourMongoDBConnectionURI"
   az functionapp config appsettings set --name MyFunctionApp --resource-group MyFunctionAppGroup --settings MONGODB_ATLAS_DATABASE=MyDatabase
   az functionapp config appsettings set --name MyFunctionApp --resource-group MyFunctionAppGroup --settings MONGODB_ATLAS_COLLECTION=MyCollection
    az functionapp config appsettings set --name MyFunctionApp --resource-group MyFunctionAppGroup --settings secretKey=secretKey
   ```

2. **Deploy the Function App**:
   Once your environment variables are configured, you can deploy your Azure Function App to the cloud using the Azure Functions Core Tools (func CLI). Run the following command:

   ```bash
   func azure functionapp publish <FUNCTION_APP_NAME>
   ```

   Example:

   ```bash
   func azure functionapp publish MyFunctionApp
   ```

   This command will package and deploy your functions to the Azure Function App.

3. **Obtain the Host Key**:
   Before you can test your functions, you need to obtain the "host key" from Azure. This key is used to secure your HTTP requests. You can usually find this key in the Azure portal under the Function App's configuration.

4. **Test Your Functions**:
   With your Function App deployed and the host key obtained, you can now test your functions using tools like cURL, Postman, or similar HTTP clients. Make HTTP requests to your function's public URL and include the host key in your request headers for authentication.

By following these steps, you should have your Azure Function with MongoDB support deployed to the cloud and ready for testing. Make sure to replace the placeholder values with your actual configuration details.

This command publishes project files from the current directory to the <FunctionAppName> as a .zip deployment package. If the project requires compilation, it's done remotely during deployment.

The following considerations apply to this kind of deployment:

Publishing overwrites existing files in the remote function app deployment.

You must have already created a [function app in your Azure subscription](https://portal.azure.com). Core Tools deploys your project code to this function app resource. To learn how to create a function app from the command prompt or terminal window using the Azure CLI or Azure PowerShell, see Create a Function App for serverless execution. You can also create these resources in the Azure portal. You get an error when you try to publish to a <FunctionAppName> that doesn't exist in your subscription.

A project folder may contain language-specific files and directories that shouldn't be published. Excluded items are listed in a .funcignore file in the root project folder.

By default, your project is deployed so that it runs from the deployment package. To disable this recommended deployment mode, use the --nozip option.

A remote build is performed on compiled projects. This can be controlled by using the --no-build option.

Use the --publish-local-settings option to automatically create app settings in your function app based on values in the local.settings.json file.


3. Once the deployment is complete, you'll receive a URL where you can access your deployed functions in the cloud.

## Resources

- [Azure Functions JavaScript Developer Guide](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=javascript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v3)
- [Azure Functions Samples](https://github.com/Azure-Samples/azure-functions-java-samples)
- [user Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference?tabs=blob&pivots=programming-language-javascript)
- [Azure CLI Documentation](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)

## License

This project is licensed under the [MIT License](LICENSE).
```
