import winston from 'winston'
import { Plugin } from '../plugin'

export class GlobalErrorPlugin implements Plugin {
  public name = 'global_error'
  private logger: winston.Logger | null = null

  constructor(name = 'global_error') {
    this.name = name
  }

  public init(logger: winston.Logger): void {
    this.logger = logger
    this.overrideGlobalErrorHandling()
  }

  // Override the global Error class to log errors to Logstash
  private overrideGlobalErrorHandling(): void {
    const logger = this.logger // Capture the logger instance in a closure

    if (!logger) return

    const originalError = global.Error

    // Extend the Error class
    class LoggableError extends originalError {
      constructor(message: string) {
        super(message)

        if (!logger) return

        // Log the error automatically via Logstash
        logger.error({
          message: this.message,
          stack: this.stack
        })

        // Ensure the name of the error is correct
        this.name = this.constructor.name
      }
    }

    // Replace the global Error class with LoggableError
    global.Error = LoggableError as unknown as typeof Error
  }
}

export default GlobalErrorPlugin
