{
   "$schema":"http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion":"1.0.0.0",
   "parameters":{
      "siteName":{
         "type":"string",
         "metadata":{
            "description":"The name of the function app that you wish to create."
         }
      }
   },
   "variables":{
      "functionAppName": "[parameters('appName')]",
      "hostingPlanName": "[concat(parameters('appName'), '-plan')]",
      "applicationInsightsName": "[parameters('appName')]",
      "storageName":"[concat('function', uniqueString(parameters('siteName')))]",
      "contentShareName":"[toLower(parameters('siteName'))]",
      "repoUrl":"",
      "branch":"master"
   },
   "resources":[
      {
         "apiVersion":"2016-03-01",
         "name":"[parameters('siteName')]",
         "type":"Microsoft.Web/sites",
         "properties":{
            "name":"[parameters('siteName')]",
            "siteConfig":{
               "appSettings":[
                  {
                     "name":"AzureWebJobsDashboard",
                     "value":"[concat('DefaultEndpointsProtocol=https;AccountName=',variables('storageName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageName')), '2015-05-01-preview').key1)]"
                  },
                  {
                     "name":"AzureWebJobsStorage",
                     "value":"[concat('DefaultEndpointsProtocol=https;AccountName=',variables('storageName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageName')), '2015-05-01-preview').key1)]"
                  },
                  {
                     "name":"WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
                     "value":"[concat('DefaultEndpointsProtocol=https;AccountName=',variables('storageName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageName')), '2015-05-01-preview').key1)]"
                  },
                  {
                     "name":"FUNCTIONS_EXTENSION_VERSION",
                     "value":"~2"
                  },
                  {
                     "name":"ROUTING_EXTENSION_VERSION",
                     "value":"~0.1"
                  },
                  {
                     "name":"WEBSITE_CONTENTSHARE",
                     "value":"[variables('contentShareName')]"
                  },
                  {
                    "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
                    "value": "[reference(resourceId('microsoft.insights/components/', variables('applicationInsightsName')), '2015-05-01').InstrumentationKey]"
                  }
               ]
            },
            "clientAffinityEnabled":false
         },
         "resources":[
            {
               "apiVersion":"2015-08-01",
               "name":"web",
               "type":"sourcecontrols",
               "dependsOn":[
                  "[resourceId('Microsoft.Web/Sites', parameters('siteName'))]"
               ],
               "properties":{
                  "RepoUrl":"[variables('repoURL')]",
                  "branch":"[variables('branch')]",
                  "IsManualIntegration":true
               }
            }
         ],
         "dependsOn":[
            "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
            "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
            "[resourceId('microsoft.insights/components', variables('applicationInsightsName'))]"
         ],
         "location":"[resourceGroup().location]",
         "kind":"functionapp"
      },
      {
          "type": "Microsoft.Web/serverfarms",
          "apiVersion": "2015-04-01",
          "name": "[variables('hostingPlanName')]",
          "location": "[resourceGroup().location]",
          
          "properties": {
              "name": "[variables('hostingPlanName')]",
              "computeMode": "Dynamic",
              "sku": "Dynamic"
          }
      },
      {
         "type": "Microsoft.Storage/storageAccounts",
         "name": "[variables('storageAccountName')]",
         "apiVersion": "2018-07-01",
         "kind": "StorageV2",
         "location": "[resourceGroup().location]",
         "sku": {
             "name": "Standard_LRS",
             "tier": "Standard"
         },
         "properties": {
             "accessTier": "Hot"
         }
      },
      {
        "apiVersion": "2018-05-01-preview",
        "name": "[variables('applicationInsightsName')]",
        "type": "microsoft.insights/components",
        "location": "East US",
        "tags": {
          "[concat('hidden-link:', resourceGroup().id, '/providers/Microsoft.Web/sites/', variables('applicationInsightsName'))]": "Resource"
        },
        "properties": {
          "ApplicationId": "[variables('applicationInsightsName')]",
          "Request_Source": "IbizaWebAppExtensionCreate"
        }
      }
   ]
}