import { IRule } from '../rule';

export class IsNumber<T> implements IRule<T> {
    check(claim: unknown): boolean {
        if (claim === null || claim === undefined) {
            return true;
        }
        return typeof claim === 'number';
    }

    message(name: string): string {
        return `Type of '${name}' must be 'number'.`;
    }
}
