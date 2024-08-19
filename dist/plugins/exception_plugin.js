"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionHandlingPlugin = void 0;
class ExceptionHandlingPlugin {
    constructor(name = 'exception_handler') {
        this.name = 'exception_handler';
        this.logger = null;
        this.name = name;
    }
    init(logger) {
        this.logger = logger;
        // Listen for unhandled exceptions
        process.on('uncaughtException', (err) => {
            this.handleException('uncaughtException', err);
        });
        // Listen for unhandled promise rejections
        process.on('unhandledRejection', (reason) => {
            this.handleException('unhandledRejection', reason);
        });
    }
    handleException(type, error) {
        var _a;
        const logData = {
            type,
            error: this.formatError(error),
        };
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(logData);
    }
    formatError(error) {
        if (error instanceof Error) {
            const name = error.name || 'Error';
            const message = error.message || 'No error message provided';
            const stack = error.stack || 'No stack trace available';
            return `${name}: ${message}\nStack: ${stack}`;
        }
        return String(error);
    }
}
exports.ExceptionHandlingPlugin = ExceptionHandlingPlugin;
exports.default = ExceptionHandlingPlugin;
