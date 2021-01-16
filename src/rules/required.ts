import { IRule } from '../rule';

export class Required<T> implements IRule<T> {
    check(claim: unknown): boolean {
        return claim !== null && claim !== undefined;
    }

    message(name: string): string[] {
        return [`The '${name}' is required.`];
    }
}
