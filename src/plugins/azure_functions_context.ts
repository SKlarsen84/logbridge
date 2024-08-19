import winston from 'winston'
import { Plugin } from '../plugin'
import { Context, HttpRequest } from '@azure/functions'

export class AzureFunctionsContextPlugin implements Plugin {
  public name = 'azure_functions'
  private logger: winston.Logger | null = null

  constructor(name = 'azure_functions') {
    this.name = name
  }

  public init(logger: winston.Logger): void {
    this.logger = logger
  }

  public applyPlugin(context: Context, request: HttpRequest): void {
    if (this.logger && context && typeof context.log === 'function') {
      // Preserve the original log methods
      const originalLog = context.log.bind(context)
      const originalErrorLog = context.log.error?.bind(context)

      // Intercept the context.log.error method
      context.log.error = (msg: unknown) => {
        // Log to Logstash via the emitter
        const logData = {
          message: msg,
          context,
          request
        }

        this.logger?.error(logData)

        // Call the original context.log.error method
        if (originalErrorLog) {
          originalErrorLog(msg)
        }
      }

      // Utility function to log with the full context object
      const logWithContext = (levelMethod: keyof winston.Logger, msg: unknown) => {
        const logData = {
          message: msg,
          context, // Include the full context object
          request // Include the full request object
        }

        // Use the specific logger method (e.g., this.logger.warn)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        ;(this.logger as winston.Logger)[levelMethod](logData)
      }

      context.log = Object.assign(
        (msg: unknown) => {
          logWithContext('info', msg)
          originalLog(msg)
        },
        {
          warn: (msg: unknown) => {
            logWithContext('warn', msg)
            originalLog.warn?.(msg)
          },
          error: (msg: unknown) => {
            logWithContext('error', msg)
            originalLog.error?.(msg)
          },
          info: (msg: unknown) => {
            logWithContext('info', msg)
            originalLog.info?.(msg)
          },
          verbose: (msg: unknown) => {
            logWithContext('verbose', msg)
            originalLog.verbose?.(msg)
          }
        }
      )
    }
  }
}

export default AzureFunctionsContextPlugin
