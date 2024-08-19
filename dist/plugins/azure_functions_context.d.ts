import winston from 'winston';
import { Plugin } from '../plugin';
import { Context, HttpRequest } from '@azure/functions';
export declare class AzureFunctionsContextPlugin implements Plugin {
    name: string;
    private logger;
    constructor(name?: string);
    init(logger: winston.Logger): void;
    applyPlugin(context: Context, request: HttpRequest): void;
}
export default AzureFunctionsContextPlugin;
//# sourceMappingURL=azure_functions_context.d.ts.map