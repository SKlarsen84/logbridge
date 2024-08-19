import winston from 'winston'
import { Plugin } from '../plugin'

export class ConsolePlugin implements Plugin {
  public name = 'console'
  private logger: winston.Logger | null = null

  constructor(name = 'console') {
    this.name = name
  }

  public init(logger: winston.Logger): void {
    this.logger = logger
    this.overrideConsoleMethods()
  }

  private overrideConsoleMethods(): void {
    const exLog = console.log
    const exWarn = console.warn
    const exError = console.error

    console.log = (...args: unknown[]) => {
      this.logger?.info(args[0])
      exLog.apply(console, args)
    }

    console.warn = (...args: unknown[]) => {
      this.logger?.warn(args[0])
      exWarn.apply(console, args)
    }

    console.error = (...args: unknown[]) => {
      this.logger?.error(args[0])
      exError.apply(console, args)
    }
  }

  public log(msg: unknown): void {
    console.log(msg)
    this.logger?.info(msg)
  }

  public warn(msg: unknown): void {
    console.warn(msg)
    this.logger?.warn(msg)
  }

  public error(msg: unknown): void {
    console.error(msg)
    this.logger?.error(msg)
  }
}

export default ConsolePlugin
