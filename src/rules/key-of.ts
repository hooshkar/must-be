/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from '../rule';
import { Keys } from 'basecript';

export class KeyOf<T> implements IRule<T> {
    private _keys: Array<keyof T>;

    constructor(private pattern: unknown) {}

    get keys(): Array<keyof T> {
        if (!this._keys) {
            this._keys = Keys(this.pattern);
        }
        return this._keys;
    }

    check(claim: unknown, p: string): boolean {
        return this.keys.indexOf((claim as any)[p]) !== -1;
    }

    message(p: string): string[] {
        return [`Property '${p}' have a invalid value.`];
    }
}
