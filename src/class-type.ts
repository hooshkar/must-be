export interface ClassType<T = unknown> {
    new (...args: unknown[]): T;
    readonly prototype: T;
}
