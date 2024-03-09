import { SQSEvent, SQSHandler, SQSBatchItemFailure } from "aws-lambda";

export const handler: SQSHandler = async (event: SQSEvent) => {
    const records = event.Records
    const batchItemFailures: SQSBatchItemFailure[] = []

    if (records.length) {
        for (let record of records) {
            try {
                const parsedBody = JSON.parse(record.body)
                console.log("The Whole Event", record.body)
                console.log("Details-UserName", parsedBody?.detail?.userName)
                console.log("Proccessiong is Successfull", JSON.stringify(record))

            } catch (error) {
                batchItemFailures.push({ itemIdentifier: record.messageId })
            }
        }
    }

    return {
        batchItemFailures
    }

}