import { Context, HttpRequest } from "@azure/functions";
export type Plugin = {
    name: string;
    init(logger?: unknown): void;
    log?(msg: unknown): void;
    warn?(msg: unknown): void;
    error?(msg: unknown): void;
    applyPlugin?(context: Context, request: HttpRequest): void;
};
export default Plugin;
//# sourceMappingURL=plugin.d.ts.map