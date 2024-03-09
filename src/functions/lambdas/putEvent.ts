import { formatJSONResponse } from "@libs/api-gateway"
import { bridge } from "@libs/eventBus"
import { APIGatewayProxyEvent } from "aws-lambda"

const EVENT_BUS_NAME = process.env.EventBusName
export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const body = JSON.parse(event.body)
        const output = await bridge.putEvent(body, EVENT_BUS_NAME)

        return formatJSONResponse({
            data: output
        })

    } catch (error) {
        return formatJSONResponse({
            data: error,
            statusCode: 500
        })
    }

}