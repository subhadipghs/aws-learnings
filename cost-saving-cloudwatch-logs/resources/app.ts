import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
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
    let body: Record<string, any> = {}
    if (event.body) {
      body = JSON.parse(event.body)
    }
    if (!body.counter) {
      throw new Error(
        body.message ?? '`counter` property is missing from http body',
      )
    }
    if (!body.action) {
      throw new Error(
        body.message ?? '`action` property is missing from http body',
      )
    }
    if (body.counter < 0) {
      throw new Error('Invalid counter value provided')
    }
    log.info('~ validations passed for the http body ✅ ~')
    switch (body.action) {
      case 'increment': {
        response.body = JSON.stringify({
          counter: increment(body.counter),
          action: body.action,
        })
        break
      }
      case 'decrement': {
        response.body = JSON.stringify({
          counter: decrement(body.counter),
          action: body.action,
        })
        break
      }
      default: {
        throw new Error(
          'Unknown action received. Expected `increment` or `decrement` operation',
        )
      }
    }
  } catch (err) {
    log.error('~ error ocurred during lambda handler ~ ⚠️', err)
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: (err as Error).message,
      }),
    }
  } finally {
    return response
  }
}

export function increment(counter: number) {
  log.debug('increment the counter', counter)
  return counter++
}

export function decrement(counter: number) {
  log.debug('decrement the counter', counter)
  return counter--
}
