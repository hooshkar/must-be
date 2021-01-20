import { IRule } from '../rule';

export class Min<T> implements IRule<T> {
    constructor(readonly min: number) {}

    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }
        switch (typeof claim) {
            case 'number':
                return claim >= this.min;
            case 'string':
                return claim.length >= this.min;
            case 'object':
                if (Array.isArray(claim)) {
                    return claim.length >= this.min;
                }
                break;
        }

        return false;
    }

    message(name: string): string {
        return `Minimum value or length of '${name}' must be '${this.min}'.`;
    }
}
