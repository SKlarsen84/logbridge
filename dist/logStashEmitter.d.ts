import { Plugin } from './plugin';
import { Context, HttpRequest } from '@azure/functions';
export type LogStashEmitterOptions = {
    plugins?: Plugin[];
    indexName?: string;
};
declare class LogStashEmitter {
    private logger;
    private plugins;
    private indexName;
    constructor(options?: LogStashEmitterOptions);
    addPlugin(plugin: Plugin): void;
    applyPlugin(pluginName: string, context: Context, request: HttpRequest): void;
}
export default LogStashEmitter;
//# sourceMappingURL=logStashEmitter.d.ts.map