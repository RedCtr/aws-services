import { EventBridgeClient, PutEventsCommand, PutEventsCommandInput } from "@aws-sdk/client-eventbridge"

const eventBridge = new EventBridgeClient({})

export const bridge = {
    putEvent: async (body: Record<string, any>, eventBusName: string) => {
        const event: PutEventsCommandInput = {
            Entries: [
                {
                    EventBusName: eventBusName,
                    DetailType: "user-signup",
                    Detail: JSON.stringify(body),
                    Time: new Date(),
                    Source: "my-login-app"

                }
            ]
        }

        const eventCommand = new PutEventsCommand(event)
        const output = await eventBridge.send(eventCommand)

        return { body, output }
    }
}