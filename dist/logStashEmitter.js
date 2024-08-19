"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_logstash_latest_js_1 = __importDefault(require("winston-logstash/lib/winston-logstash-latest.js"));
class LogStashEmitter {
    constructor(options = {}) {
        this.logger = null;
        this.plugins = new Map();
        this.indexName = options.indexName;
        if ((process.env.LOGSTASH_HOST && process.env.LOGSTASH_PORT) || process.env.LOGSTASH_AUTH_TOKEN) {
            this.logger = winston_1.default.createLogger({
                transports: [
                    new winston_logstash_latest_js_1.default({
                        port: Number(process.env.LOGSTASH_PORT) || 0,
                        host: process.env.LOGSTASH_HOST || ''
                    })
                ],
                defaultMeta: { index_name: this.indexName, auth_token: process.env.LOGSTASH_AUTH_TOKEN },
                format: winston_1.default.format.combine(winston_1.default.format(info => info)(), winston_1.default.format.json() // Ensure logs are sent as JSON
                )
            });
            if (options.plugins) {
                options.plugins.forEach(plugin => this.addPlugin(plugin));
            }
        }
        else {
            console.log('LOGSTASH_HOST and LOGSTASH_PORT environment variables are not set or LOGSTASH_AUTH_TOKEN is missing. Logging to Logstash is disabled.');
        }
    }
    addPlugin(plugin) {
        if (typeof plugin.init === 'function') {
            plugin.init(this.logger || undefined);
            this.plugins.set(plugin.name, plugin);
        }
    }
    applyPlugin(pluginName, context, request) {
        const plugin = this.plugins.get(pluginName);
        if (plugin && typeof plugin.applyPlugin === 'function') {
            plugin.applyPlugin(context, request);
        }
        else {
            console.warn(`Plugin "${pluginName}" not found or does not have an applyPlugin method.`);
        }
    }
}
exports.default = LogStashEmitter;
