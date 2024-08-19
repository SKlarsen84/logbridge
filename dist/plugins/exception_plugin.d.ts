import winston from 'winston';
import { Plugin } from '../plugin';
export declare class ExceptionHandlingPlugin implements Plugin {
    name: string;
    private logger;
    constructor(name?: string);
    init(logger: winston.Logger): void;
    private handleException;
    private formatError;
}
export default ExceptionHandlingPlugin;
//# sourceMappingURL=exception_plugin.d.ts.map