/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from '../rule';

export class Max<T> implements IRule<T> {
    constructor(readonly max: number) {}

    check(claim: unknown, p: string): boolean {
        if (typeof (claim as any)[p] !== 'number') {
            return true;
        }

        return ((claim as any)[p] as number) <= this.max;
    }

    message(p: string): string[] {
        return [`Maximum value of property '${p}' is '${this.max}'.`];
    }
}
