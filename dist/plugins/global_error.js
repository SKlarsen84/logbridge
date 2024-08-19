"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorPlugin = void 0;
class GlobalErrorPlugin {
    constructor(name = 'global_error') {
        this.name = 'global_error';
        this.logger = null;
        this.name = name;
    }
    init(logger) {
        this.logger = logger;
        this.overrideGlobalErrorHandling();
    }
    // Override the global Error class to log errors to Logstash
    overrideGlobalErrorHandling() {
        const logger = this.logger; // Capture the logger instance in a closure
        if (!logger)
            return;
        const originalError = global.Error;
        // Extend the Error class
        class LoggableError extends originalError {
            constructor(message) {
                super(message);
                if (!logger)
                    return;
                // Log the error automatically via Logstash
                logger.error({
                    message: this.message,
                    stack: this.stack
                });
                // Ensure the name of the error is correct
                this.name = this.constructor.name;
            }
        }
        // Replace the global Error class with LoggableError
        global.Error = LoggableError;
    }
}
exports.GlobalErrorPlugin = GlobalErrorPlugin;
exports.default = GlobalErrorPlugin;
