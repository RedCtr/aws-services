import type { AWS } from '@serverless/typescript';

import { hello, authorizer, putEvent, proccessEvent } from '@functions/lambdas';
import resources from 'src/resources';

const serverlessConfiguration: AWS = {
  service: 'login-demo',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function'],
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
    proccessEvent
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
};

module.exports = serverlessConfiguration;
