/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from '../rule';

export class MaxChar<T> implements IRule<T> {
    constructor(readonly maxChar: number) {}

    check(claim: unknown, p: string): boolean {
        if (typeof (claim as any)[p] !== 'string') {
            return true;
        }

        return ((claim as any)[p] as string).length <= this.maxChar;
    }

    message(p: string): string[] {
        return [`Maximum character of property '${p}' is '${this.maxChar}'.`];
    }
}
