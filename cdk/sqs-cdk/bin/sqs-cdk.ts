#!/usr/bin/env node
import * as cdk from "aws-cdk-lib"
import {SqsCdkStack} from "../lib/sqs-cdk-stack"

const app = new cdk.App()
new SqsCdkStack(app, "SqsCdkStack")
