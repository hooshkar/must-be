import { IRule } from '../rule';

export class Max<T> implements IRule<T> {
    constructor(readonly max: number) {}

    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }
        switch (typeof claim) {
            case 'number':
                return claim <= this.max;
            case 'string':
                return claim.length <= this.max;
            case 'object':
                if (Array.isArray(claim)) {
                    return claim.length <= this.max;
                }
                break;
        }

        return false;
    }

    message(name: string): string[] {
        return [`Maximum value or length of '${name}' must be '${this.max}'.`];
    }
}
