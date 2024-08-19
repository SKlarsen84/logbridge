"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorPlugin = exports.ConsolePlugin = exports.AzureFunctionsContextPlugin = exports.LogStashEmitter = void 0;
const logStashEmitter_1 = __importDefault(require("./logStashEmitter"));
exports.LogStashEmitter = logStashEmitter_1.default;
const azure_functions_context_1 = __importDefault(require("./plugins/azure_functions_context"));
exports.AzureFunctionsContextPlugin = azure_functions_context_1.default;
const console_plugin_1 = __importDefault(require("./plugins/console_plugin"));
exports.ConsolePlugin = console_plugin_1.default;
const global_error_1 = __importDefault(require("./plugins/global_error"));
exports.GlobalErrorPlugin = global_error_1.default;
