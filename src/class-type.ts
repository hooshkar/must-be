/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClassType<T> {
    new (...args: any[]): T;
    readonly prototype: T;
}
