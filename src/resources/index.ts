import { AWS } from '@serverless/typescript';

export default {
    MyEventBus: {
        Type: "AWS::Events::EventBus",
        Properties: {
            "Name": "my-custom-app-bus",
        }
    },
    TargetSQS: {
        Type: "AWS::SQS::Queue",
        Properties: {
            "QueueName": "users-custom-queue",
        }
    },
    MyEventTargetsRule: {
        Type: "AWS::Events::Rule",
        Properties: {
            "Name": "custome-userName-rule",
            "Description": "Just forward event based on userName",
            "EventBusName": { "Fn::GetAtt": ["MyEventBus", "Arn"] },
            "EventPattern": {
                source: ["my-login-app"],
                "detail-type": ["user-signup"],
            },
            Targets: [
                {
                    "Arn": { "Fn::GetAtt": ["TargetSQS", "Arn"] },
                    "Id": "user-event-bus-target-sqs-dev"
                }
            ]
        }
    },
    // we need to create a based-resource-iam-policy at sqs in order 
    // to allow eventBridge to put this events in SQS
    TargetSQSPolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
            "Queues": [{ "Ref": "TargetSQS" }],
            "PolicyDocument": {
                "Statement": [{
                    "Action": ["SQS:SendMessage"],
                    "Effect": "Allow",
                    "Resource": { "Fn::GetAtt": ["TargetSQS", "Arn"] },
                    "Principal": {
                        "Service": "events.amazonaws.com"
                    }
                }]
            }
        }
    },
} satisfies AWS["resources"]["Resources"] 