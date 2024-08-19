import winston from 'winston';
import { Plugin } from '../plugin';
export declare class GlobalErrorPlugin implements Plugin {
    name: string;
    private logger;
    constructor(name?: string);
    init(logger: winston.Logger): void;
    private overrideGlobalErrorHandling;
}
export default GlobalErrorPlugin;
//# sourceMappingURL=global_error.d.ts.map