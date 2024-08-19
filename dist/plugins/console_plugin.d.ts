import winston from 'winston';
import { Plugin } from '../plugin';
export declare class ConsolePlugin implements Plugin {
    name: string;
    private logger;
    constructor(name?: string);
    init(logger: winston.Logger): void;
    private overrideConsoleMethods;
    log(msg: unknown): void;
    warn(msg: unknown): void;
    error(msg: unknown): void;
}
export default ConsolePlugin;
//# sourceMappingURL=console_plugin.d.ts.map