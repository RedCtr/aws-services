import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = ({
  statusCode = 200,
  data = {},
  headers,
}: {
  statusCode?: number;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
}) => {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      ...headers,
    },
  };
};
