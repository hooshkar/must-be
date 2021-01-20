import { IRule } from '../rule';

export class IsBoolean<T> implements IRule<T> {
    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }
        return typeof claim === 'boolean';
    }

    message(name: string): string {
        return `Type of '${name}' must be 'boolean'.`;
    }
}
