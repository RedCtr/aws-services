import { AWS } from '@serverless/typescript';
import schema from './test/schema';
import { handlerPath } from '@libs/handler-resolver';

export const authorizer = {
  handler: `${handlerPath(__dirname)}/authorizer.authorize`,
} satisfies AWS["functions"]["authorizer"];

export const hello = {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        authorizer: "authorizer"
      },
    },
  ],
} satisfies AWS["functions"]["hello"];

export const putEvent = {
  handler: `${handlerPath(__dirname)}/putEvent.handler`,
  environment: {
    EventBusName: { "Ref": "MyEventBus" }
  },
  iamRoleStatementsName: "lambda-put-event-role",
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: "events:PutEvents",
      Resource: [
        { "Fn::GetAtt": ["MyEventBus", "Arn"] },
      ],
    },
  ],
  events: [
    {
      http: {
        method: 'post',
        path: 'generate',
      },
    },
  ],
} as AWS["functions"]["putEvent"];


export const proccessEvent = {
  handler: `${handlerPath(__dirname)}/proccessEvents.handler`,
  events: [
    {
      sqs: {
        arn: { "Fn::GetAtt": ["TargetSQS", "Arn"] },
        batchSize: 10,
        maximumConcurrency: 1,
        functionResponseType: "ReportBatchItemFailures",
      }
    }
  ],
} as AWS["functions"]["proccessEvent"];



