/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from '../rule';
import { Keys } from 'basecript';

export class KeyOf<T> implements IRule<T> {
    readonly keys: Array<keyof T>;

    constructor(pattern: unknown) {
        this.keys = Keys(pattern);
    }
    check(claim: unknown, p: string): boolean {
        return this.keys.indexOf((claim as any)[p]) !== -1;
    }

    message(p: string): string[] {
        return [`Property '${p}' have a invalid value.`];
    }
}
