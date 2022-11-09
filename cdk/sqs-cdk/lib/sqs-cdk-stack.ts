import * as path from "path"
import {Duration, Stack, StackProps} from "aws-cdk-lib"
import * as sns from "aws-cdk-lib/aws-sns"
import * as subs from "aws-cdk-lib/aws-sns-subscriptions"
import * as sqs from "aws-cdk-lib/aws-sqs"
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs"
import {Construct} from "constructs"
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources"

export class SqsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const queue = new sqs.Queue(this, "SubhadipSqsSampleCdkQueue", {
      visibilityTimeout: Duration.seconds(300),
      receiveMessageWaitTime: Duration.seconds(20),
    })

    const topic = new sns.Topic(this, "SqsCdkTopic")

    topic.addSubscription(new subs.SqsSubscription(queue))

    // SQS Message Processor
    const topicHandler = new lambda.NodejsFunction(
      this,
      "SqsCdkTopicMessageHandler",
      {
        functionName: "SqsTopicHandler",
        handler: "handler",
        entry: path.join(__dirname, `/../lambda/process-sqs-message.ts`),
        memorySize: 128,
        bundling: {
          minify: true,
          sourceMap: true,
          target: "es2020",
        },
      }
    )
    topicHandler.addEventSource(
      new SqsEventSource(queue, {
        batchSize: 2,
        maxBatchingWindow: Duration.minutes(1),
        reportBatchItemFailures: true,
      })
    )
  }
}
