/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from '../rule';

export class KeyOf<T> implements IRule<T> {
    private _keys: Array<keyof T>;

    constructor(private pattern: unknown) {}

    get keys(): Array<keyof T> {
        if (!this._keys) {
            this._keys = <(keyof T)[]>Object.keys(this.pattern);
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
