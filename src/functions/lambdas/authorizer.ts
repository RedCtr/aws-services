import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayTokenAuthorizerEvent, AuthResponse, Context } from "aws-lambda";

type tokenType = "allow" | "deny"
export const authorize = async (event: APIGatewayTokenAuthorizerEvent, context: Context, cb?: (error?: string, callback?: AuthResponse) => void) => {
    console.log("Authorize Lambda Event", JSON.stringify(event))
    try {
        const token = event.authorizationToken as tokenType

        if (!token) {
            return formatJSONResponse({
                statusCode: 403,
                data: {
                    message: "Unautherized, you should provide a token"
                }
            })
        }

        if (token === "allow") {
            cb(null, generatePolicy("user", "Allow", event.methodArn))
        }

        if (token === "deny") {
            cb(null, generatePolicy("user", "Deny", event.methodArn))
        }

    } catch (error) {
        console.log("Authorize Error", error)
        cb("something happend check logs", generatePolicy("user", "Deny", event.methodArn))
    }

}

const generatePolicy = (principalId: string, effect: string, resource: string) => {
    const authResponse: AuthResponse = {
        principalId: principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Resource: resource,
                    Action: "execute-api:Invoke"
                }
            ]
        },
        context: {
            name: "Red",
            lastName: "Ctr",
            message: "pass custom data to the downstream lambda function"
        }
    }

    console.log("authResponse", JSON.stringify(authResponse))
    return authResponse
}