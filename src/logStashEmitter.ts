import winston from 'winston'
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest.js'
import { Plugin } from './plugin'
import { Context, HttpRequest } from '@azure/functions'

export type LogStashEmitterOptions = {
  plugins?: Plugin[]
  indexName?: string // Option to set the index name
}

class LogStashEmitter {
  private logger: winston.Logger | null = null
  private plugins: Map<string, Plugin> = new Map()
  private indexName: string | undefined

  constructor(options: LogStashEmitterOptions = {}) {
    this.indexName = options.indexName

    if ((process.env.LOGSTASH_HOST && process.env.LOGSTASH_PORT) || process.env.LOGSTASH_AUTH_TOKEN) {
      this.logger = winston.createLogger({
        transports: [
          new LogstashTransport({
            port: Number(process.env.LOGSTASH_PORT) || 0,
            host: process.env.LOGSTASH_HOST || ''
          })
        ],
        defaultMeta: { index_name: this.indexName, auth_token: process.env.LOGSTASH_AUTH_TOKEN },
        format: winston.format.combine(
          winston.format(info => info)(),
          winston.format.json() // Ensure logs are sent as JSON
        )
      })
      if (options.plugins) {
        options.plugins.forEach(plugin => this.addPlugin(plugin))
      }
    } else {
      console.log(
        'LOGSTASH_HOST and LOGSTASH_PORT environment variables are not set or LOGSTASH_AUTH_TOKEN is missing. Logging to Logstash is disabled.'
      )
    }
  }

  public addPlugin(plugin: Plugin): void {
    if (typeof plugin.init === 'function') {
      plugin.init(this.logger || undefined)
      this.plugins.set(plugin.name, plugin)
    }
  }

  public applyPlugin(pluginName: string, context: Context, request: HttpRequest): void {
    const plugin = this.plugins.get(pluginName)
    if (plugin && typeof plugin.applyPlugin === 'function') {
      plugin.applyPlugin(context, request)
    } else {
      console.warn(`Plugin "${pluginName}" not found or does not have an applyPlugin method.`)
    }
  }
}

export default LogStashEmitter
