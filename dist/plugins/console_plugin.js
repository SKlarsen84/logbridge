"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsolePlugin = void 0;
class ConsolePlugin {
    constructor(name = 'console') {
        this.name = 'console';
        this.logger = null;
        this.name = name;
    }
    init(logger) {
        this.logger = logger;
        this.overrideConsoleMethods();
    }
    overrideConsoleMethods() {
        const exLog = console.log;
        const exWarn = console.warn;
        const exError = console.error;
        console.log = (...args) => {
            var _a;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info(args[0]);
            exLog.apply(console, args);
        };
        console.warn = (...args) => {
            var _a;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn(args[0]);
            exWarn.apply(console, args);
        };
        console.error = (...args) => {
            var _a;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(args[0]);
            exError.apply(console, args);
        };
    }
    log(msg) {
        var _a;
        console.log(msg);
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info(msg);
    }
    warn(msg) {
        var _a;
        console.warn(msg);
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn(msg);
    }
    error(msg) {
        var _a;
        console.error(msg);
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(msg);
    }
}
exports.ConsolePlugin = ConsolePlugin;
exports.default = ConsolePlugin;
