import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { Logger } from './utils/logger'

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const log = Logger.getLogger('lambda')

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  try {
    log.debug('~ the event ~ 🚀', event)
    let query: APIGatewayProxyEventQueryStringParameters | null =
      event.queryStringParameters

    if (!query || Object.keys(query).length <= 0) {
      throw new Error('query is required')
    }

    if (!query.counter) {
      throw new Error('`counter` property is missing from http body')
    }
    if (!query.action) {
      throw new Error('`action` property is missing from http body')
    }

    log.info('~ validations passed for the http query parameters ✅ ~')

    if (parseInt(query.counter) < 0) {
      throw new Error('Invalid counter value provided')
    }

    switch (query.action) {
      case 'increment': {
        response.body = JSON.stringify({
          counter: increment(parseInt(query.counter)),
        })
        break
      }
      case 'decrement': {
        response.body = JSON.stringify({
          counter: decrement(parseInt(query.counter)),
        })
        break
      }
      default: {
        throw new Error('Expected `increment` or `decrement` operation')
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      log.error('~ error occured in the lambda ~', err)
      response.statusCode = 500
      response.body = JSON.stringify({
        message: (err as Error).message,
      })
    }
  } finally {
    return response
  }
}

export function increment(counter: number) {
  log.debug('increment the counter', counter)
  return counter + 1
}

export function decrement(counter: number) {
  log.debug('decrement the counter', counter)
  return counter - 1
}
