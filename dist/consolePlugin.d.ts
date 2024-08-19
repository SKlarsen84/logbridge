import { Context } from "@azure/functions";
export type Plugin = {
    name: string;
    init(logger?: unknown): void;
    log?(msg: unknown): void;
    warn?(msg: unknown): void;
    error?(msg: unknown): void;
    applyPlugin?(context: Context): void;
};
export default Plugin;
//# sourceMappingURL=consolePlugin.d.ts.map