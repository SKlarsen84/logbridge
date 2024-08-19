
declare module 'winston-logstash/lib/winston-logstash-latest.js' {
  import { TransportStreamOptions } from 'winston-transport';
  import TransportStream from 'winston-transport';
  
  export interface LogstashTransportOptions extends TransportStreamOptions {
    port: number;
    host: string;
    node_name?: string;
    pid?: boolean;
    tags?: string[];
  }

  class LogstashTransport extends TransportStream {
    constructor(options: LogstashTransportOptions);
  }

  export = LogstashTransport;
}
