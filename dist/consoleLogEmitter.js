"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_logstash_latest_js_1 = __importDefault(require("winston-logstash/lib/winston-logstash-latest.js"));
class ConsoleLogEmitter {
    constructor(options = {}) {
        this.logger = null;
        this.plugins = [];
        if (process.env.LOGSTASH_HOST && process.env.LOGSTASH_PORT) {
            this.logger = winston_1.default.createLogger({
                transports: [
                    new winston_logstash_latest_js_1.default({
                        port: Number(process.env.LOGSTASH_PORT) || 0,
                        host: process.env.LOGSTASH_HOST || ''
                    })
                ]
            });
        }
        else {
            console.log('Environment variables for LOGSTASH_HOST and LOGSTASH_PORT are not set. Console_to_logstash will not be enabled.');
        }
        if (options.plugins) {
            options.plugins.forEach(plugin => this.addPlugin(plugin));
        }
        this.overrideConsoleMethods();
    }
    addPlugin(plugin) {
        if (typeof plugin.init === 'function') {
            plugin.init(this.logger || undefined);
            this.plugins.push(plugin);
        }
    }
    logMessage(level, msg) {
        if (this.logger) {
            const logEntry = {
                level: level,
                message: ''
            };
            if (msg instanceof Error) {
                logEntry.message = msg.message;
                logEntry.error = msg;
                logEntry.stackTrace = msg.stack;
            }
            else if (msg instanceof Object) {
                logEntry.message = JSON.stringify(msg);
            }
            else if (typeof msg === 'string') {
                logEntry.message = msg;
            }
            this.logger.log(logEntry);
        }
        this.plugins.forEach(plugin => {
            const pluginMethod = plugin[level];
            if (typeof pluginMethod === 'function') {
                pluginMethod(msg);
            }
        });
    }
    overrideConsoleMethods() {
        const exLog = console.log;
        const exWarn = console.warn;
        const exError = console.error;
        console.log = (...args) => {
            exLog.apply(console, args);
            this.logMessage('info', args[0]);
        };
        console.warn = (...args) => {
            exWarn.apply(console, args);
            this.logMessage('warn', args[0]);
        };
        console.error = (...args) => {
            exError.apply(console, args);
            this.logMessage('error', args[0]);
        };
    }
}
exports.default = ConsoleLogEmitter;
