import { IRule } from '../rule';

export class NotEmpty<T> implements IRule<T> {
    check(claim: unknown): boolean {
        const state = claim !== null && claim !== undefined && claim !== '';

        if (state && Array.isArray(claim)) {
            return claim.length > 0;
        }

        return state;
    }

    message(name: string): string[] {
        return [`The '${name}' must be not empty.`];
    }
}
