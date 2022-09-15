type Any = any

type LogBuffer = string[]

interface ILogger {
  info: (message: string, ...args: Any[]) => void
  debug: (message: string, ...args: Any[]) => void
  error: (message: string, ...args: Any[]) => void
}

enum LogLevel {
  Error = 0,
  Info,
  Debug,
}

export const logLevelMap: Map<LogLevel, string> = new Map()
  .set(LogLevel.Error, 'error')
  .set(LogLevel.Info, 'info')
  .set(LogLevel.Debug, 'debug')

export class Logger implements ILogger {
  private ctx: string
  private maxBufferSize: number = 1000
  private buffer: LogBuffer
  static instance: Logger

  constructor(context: string) {
    this.ctx = context
    this.buffer = []
  }

  static getLogger(ctx: string) {
    if (Logger.instance) {
      Logger.instance = new Logger(ctx)
    }
    return Logger.instance
  }

  private flushBuffer() {
    this.buffer.length = 0
  }

  private formatLog(level: LogLevel, msg: string, ...args: Any[]) {
    const currentDate = new Date().toLocaleString()
    let otherArgs: string = ''
    if (args.length > 0) {
      otherArgs = JSON.stringify(args)
    }
    return `${logLevelMap.get(level)} - ${currentDate} ~ ${
      this.ctx
    } ~ ${msg} ${otherArgs}`
  }

  info(msg: string, ...args: Any[]) {
    console.info(this.formatLog(LogLevel.Info, msg, args))
  }

  debug(msg: string, ...args: Any[]) {
    if (this.buffer.length > this.maxBufferSize) {
      this.flushBuffer()
      return
    }
    this.buffer.push(this.formatLog(LogLevel.Debug, msg, ...args))
  }

  error(msg: string, ...args: Any[]) {
    this.buffer.forEach((log) => {
      console.log(log)
    })
    this.flushBuffer()
    console.error(this.formatLog(LogLevel.Error, msg, args))
  }
}
