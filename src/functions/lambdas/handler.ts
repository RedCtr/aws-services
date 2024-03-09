import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './test/schema';
import { dynamo } from '@libs/dynamo';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from "uuid";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    statusCode: 200,
    data: {
      message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
      event,
    }
  })
};

export const main = middyfy(hello);

export const handler = async (event: APIGatewayProxyEvent) => {
  // will be shown or logged in cloudWatch
  console.log("handler Lambda event", JSON.stringify(event))
  try {
    const body = JSON.parse(event.body);

    const data = {
      ...body,
      noteId: uuid(),
    };
    await dynamo.write(data, "notes")

    return formatJSONResponse({
      data: {
        message: `data is saved`,
        id: data.id,
      },
    });
  } catch (error) {
    console.log("error", error);
    return formatJSONResponse({
      statusCode: 502,
      data: {
        message: error.message,
      },
    });
  }
};

