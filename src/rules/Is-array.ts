import { IRule } from '../rule';

export class IsArray<T> implements IRule<T> {
    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }
        return Array.isArray(claim);
    }

    message(name: string): string[] {
        return [`Type of '${name}' must be 'array'.`];
    }
}
