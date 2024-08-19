import winston from 'winston';
export type Plugin = {
    init(logger?: winston.Logger): void;
    info?(msg: unknown): void;
    log?(msg: unknown): void;
    warn?(msg: unknown): void;
    error?(msg: unknown): void;
};
type ConsoleLogEmitterOptions = {
    plugins?: Plugin[];
};
declare class ConsoleLogEmitter {
    private logger;
    private plugins;
    constructor(options?: ConsoleLogEmitterOptions);
    addPlugin(plugin: Plugin): void;
    private logMessage;
    private overrideConsoleMethods;
}
export default ConsoleLogEmitter;
//# sourceMappingURL=consoleLogEmitter.d.ts.map