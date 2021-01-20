import { IRule } from '../rule';

export class In<T> implements IRule<T> {
    constructor(readonly values: unknown[]) {}

    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }

        return this.values.indexOf(claim) !== -1;
    }

    message(name: string): string {
        return `The '${name}' must be include in '${this.values}'.`;
    }
}
