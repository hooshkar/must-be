import { IRule } from '../rule';

export class Regex<T> implements IRule<T> {
    constructor(readonly pattern: RegExp) {}

    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }

        if (typeof claim !== 'string') {
            return false;
        }

        return this.pattern.test(claim);
    }

    message(name: string): string[] {
        return [`The '${name}' must be match regex '${this.pattern}'.`];
    }
}
