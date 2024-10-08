﻿# LogBridge Setup Guide

This guide will walk you through setting up `Logbridge`, a Node.js logging utility that emits logs to a Logstash server. The tool integrates with Azure Functions and provides global error handling, console log overrides, and context-aware logging.




## Plugins

- **Global Error Handling**: Automatically logs uncaught exceptions to Logstash.
- **Console**: Intercepts `console.log`, `console.warn`, and `console.error` to send output to Logstash.
- **Azure Functions**: Captures Azure Functions context and request details for better traceability.
- **Plugin System**: The modular design allows you to add, remove, and customize plugins for specific logging needs. See below for how to create your own plugins.

## Installation

1. Install the necessary dependencies:

```bash
npm install winston winston-logstash logbridge
```

2. Create your LogStashEmitter instance and configure the plugins:

```javascript
import { AzureFunctionsContextPlugin, ConsolePlugin, GlobalErrorPlugin, LogStashEmitter } from 'logbridge'

// Hook up all our logging to Logstash
export const logEmitter = new LogStashEmitter({
  indexName: 'my-nodejs-application',
  plugins: [
    new ConsolePlugin('console'),
    new AzureFunctionsContextPlugin('azure'),
    new GlobalErrorPlugin('global_error')
  ]
})

// Apply the Azure Functions plugin in your function
logEmitter.applyPlugin('azure', context, req)
```

## Logstash Configuration

Your Logstash instance needs to be configured to handle incoming logs correctly, including validating an authentication token and routing logs based on the index name.

Below is an example of a `logstash.conf` that accomplishes this:

```
input {
    beats {
        port => 5044
    }

    tcp {
        port => 50000
        codec => json_lines  # Parse JSON lines
    }
}

filter {
    # Validate the auth_token against the environment variable
    if [auth_token] != "<YOUR_AUTH_TOKEN>" {
        drop { }
    } else {
        mutate {
            remove_field => ["auth_token"]
        }
    }

    # Extract the index_name from the metadata
    if [index_name] {
        mutate {
            add_field => { "[@metadata][index_name]" => "%{[index_name]}" }
        }
    } else {
        # Fallback to a default index if index_name is not present
        mutate {
            add_field => { "[@metadata][index_name]" => "default" }
        }
    }
}

output {
    elasticsearch {
        hosts => "elasticsearch:9200"
        user => "logstash_internal"
        password => "\${LOGSTASH_INTERNAL_PASSWORD}"
        index => "node-logs-%{[@metadata][index_name]}"
    }

    stdout {
        codec => rubydebug {
            metadata => "true"
        }
    }
}
```

### Explanation:

1. **Authentication Token**: The `auth_token` field is checked, and logs are dropped if the token doesn't match.
2. **Index Name Handling**: The `index_name` field is used to dynamically set the Elasticsearch index. If `index_name` is missing, it falls back to a default index.
3. **Output Configuration**: Logs are sent to both Elasticsearch and stdout for debugging.

## How It Works

- **GlobalErrorPlugin**: This plugin overrides the global `Error` class to automatically log uncaught exceptions to Logstash.
- **ConsolePlugin**: Overrides `console.log`, `console.warn`, and `console.error` to forward logs to Logstash.
- **AzureFunctionsContextPlugin**: Captures and logs context and request information in Azure Functions.

## Example Usage

Here’s how you can use `LogStashEmitter` in an Azure Function:

```javascript
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { logEmitter } from './logStash'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  logEmitter.applyPlugin('azure', context, req)

  try {
    // Your function logic here
  } catch (error) {
    context.log.error('An error occurred', error)
  }
}

export default httpTrigger
```

## Creating a Custom Plugin

The `LogStashEmitter` is built with a flexible plugin system that allows you to create and add your own custom plugins. These plugins can intercept and modify the log messages or introduce entirely new logging behaviors.

### Structure of a Plugin

A plugin in `LogStashEmitter` needs to implement the following interface:

```typescript
interface Plugin {
  name: string
  init(logger: winston.Logger | undefined): void
  applyPlugin?(context: Context, request: HttpRequest): void
}
```

- name: The name of the plugin (used to identify and apply it).
- init(logger: winston.Logger | undefined): The initialization method where you can access the logger instance.
- applyPlugin(context: Context, request: HttpRequest): (Optional) Method for plugins that need to interact with the Azure Functions context and request.

### Example Plugin

Let’s create a simple plugin that adds a timestamp to every azure context.log message before sending it to Logstash.

```typescript
import winston from 'winston'
import { Plugin } from '../plugin'

export class CustomTimestampPlugin implements Plugin {
  public name = 'custom_timestamp'
  private logger: winston.Logger | null = null

  constructor(name = 'custom_timestamp') {
    this.name = name
  }

  public init(logger: winston.Logger): void {
    this.logger = logger
  }

  public applyPlugin(context: any): void {
    // Example of modifying context logs by adding a timestamp
    const originalLog = context.log.bind(context)

    context.log = (msg: unknown) => {
      const logData = {
        message: msg,
        timestamp: new Date().toISOString() // Add a timestamp
      }

      this.logger?.info(logData)
      originalLog(msg)
    }
  }
}
```

You can add your custom plugin to LogStashEmitter like this:

```typescript
import { LogStashEmitter } from 'logbridge'
import { CustomTimestampPlugin } from './plugins/custom_timestamp_plugin'

const logEmitter = new LogStashEmitter({
  indexName: 'my-nodejs-application',
  plugins: [new CustomTimestampPlugin()]
})

// Apply the plugin in your Azure Function
logEmitter.applyPlugin('custom_timestamp', context, req)
```

## License

This project is licensed under the MIT License.
