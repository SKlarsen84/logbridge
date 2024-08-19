"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureFunctionsContextPlugin = void 0;
class AzureFunctionsContextPlugin {
    constructor(name = 'azure_functions') {
        this.name = 'azure_functions';
        this.logger = null;
        this.name = name;
    }
    init(logger) {
        this.logger = logger;
    }
    applyPlugin(context, request) {
        var _a;
        if (this.logger && context && typeof context.log === 'function') {
            // Preserve the original log methods
            const originalLog = context.log.bind(context);
            const originalErrorLog = (_a = context.log.error) === null || _a === void 0 ? void 0 : _a.bind(context);
            // Intercept the context.log.error method
            context.log.error = (msg) => {
                var _a;
                // Log to Logstash via the emitter
                const logData = {
                    message: msg,
                    context,
                    request
                };
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(logData);
                // Call the original context.log.error method
                if (originalErrorLog) {
                    originalErrorLog(msg);
                }
            };
            // Utility function to log with the full context object
            const logWithContext = (levelMethod, msg) => {
                const logData = {
                    message: msg,
                    context, // Include the full context object
                    request // Include the full request object
                };
                this.logger[levelMethod](logData);
            };
            context.log = Object.assign((msg) => {
                logWithContext('info', msg);
                originalLog(msg);
            }, {
                warn: (msg) => {
                    var _a;
                    logWithContext('warn', msg);
                    (_a = originalLog.warn) === null || _a === void 0 ? void 0 : _a.call(originalLog, msg);
                },
                error: (msg) => {
                    var _a;
                    logWithContext('error', msg);
                    (_a = originalLog.error) === null || _a === void 0 ? void 0 : _a.call(originalLog, msg);
                },
                info: (msg) => {
                    var _a;
                    logWithContext('info', msg);
                    (_a = originalLog.info) === null || _a === void 0 ? void 0 : _a.call(originalLog, msg);
                },
                verbose: (msg) => {
                    var _a;
                    logWithContext('verbose', msg);
                    (_a = originalLog.verbose) === null || _a === void 0 ? void 0 : _a.call(originalLog, msg);
                }
            });
        }
    }
}
exports.AzureFunctionsContextPlugin = AzureFunctionsContextPlugin;
exports.default = AzureFunctionsContextPlugin;
