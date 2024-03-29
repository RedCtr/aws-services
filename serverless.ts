import type { AWS } from '@serverless/typescript';

import { hello, authorizer, putEvent, proccessEvent } from '@functions/lambdas';
import resources from 'src/resources';

const serverlessConfiguration = {
  service: 'login-demo',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function', 'serverless-step-functions'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: "eu-north-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:*",
        Resource: [
          "arn:aws:dynamodb:eu-north-1:287291510667:table/notes",
        ],
      },
    ]
  },
  // import the function via paths
  functions: {
    authorizer,
    hello,
    putEvent,
    proccessEvent,
    checkInventoryLambda: {
      handler: "src/functions/handler.checkInventory"
    }
  },
  stepFunctions: {
    stateMachines: {
      InventoryCheckoutFlow: {
        name: "inventoryCheckoutFlow",
        definition: {
          StartAt: "CheckCustomerDetailType",
          States: {
            CheckCustomerDetailType: {
              "Type": "Choice",
              "Choices": [
                {
                  "Variable": "$.detail-type",
                  "StringEquals": "CustomerFirstNameSet",
                  "Next": "DispatchEventState"
                },
                {
                  "Variable": "$.detail-type",
                  "StringEquals": "CustomerLastNameSet",
                  "Next": "CheckInventoryLambda"
                }
              ],
              "Default": "FinalState"
            },
            DispatchEventState: {
              "Type": "Task",
              "Resource": "arn:aws:states:::sns:publish",
              "Parameters": {
                "TopicArn": "arn:aws:sns:eu-north-1:287291510667:NotifyCommerceTool",
                "Message.$": "$"
              },
              "Next": "DispatchMessageSucceed"
            },
            CheckInventoryLambda: {
              "Type": "Task",
              "Resource": { "Fn::GetAtt": ["checkInventoryLambda", "Arn"] },
              "ResultPath": "$.user",
              "Next": "WaitingSomeSeconds"
            },

            WaitingSomeSeconds: {
              "Type": "Wait",
              "Seconds": 10,
              "Next": "FinalState"
            },
            DispatchMessageSucceed: {
              "Type": "Pass",
              "Result": "An Email send with the event information to roomctr@gmail.com",
              End: true
            },
            FinalState: {
              "Type": "Pass",
              "Result": "Final State ......sss",
              "End": true
            }
          }
        }
      }
    }

  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      ...resources
    },
    Outputs: {
      MyBusName: {
        Value: { "Ref": "MyEventBus" }
      }
    }
  }
} as AWS;

module.exports = serverlessConfiguration;
