import { IRule } from '../rule';

export class KeyOf<T> implements IRule<T> {
    private _keys: Array<keyof T>;

    constructor(private pattern: T) {}

    get keys(): Array<keyof T> {
        if (!this._keys) {
            this._keys = <(keyof T)[]>Object.keys(this.pattern);
        }
        return this._keys;
    }

    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }
        return this.keys.indexOf(<keyof T>claim) !== -1;
    }

    message(name: string): string[] {
        return [`The '${name}' must be key of '${this.keys}'.`];
    }
}
