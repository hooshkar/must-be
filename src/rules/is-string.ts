import { IRule } from '../rule';

export class IsString<T> implements IRule<T> {
    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }
        return typeof claim === 'string';
    }

    message(name: string): string[] {
        return [`Type of '${name}' must be 'string'.`];
    }
}
