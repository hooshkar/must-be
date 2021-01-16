import { IRule } from '../rule';

export class Defined<T> implements IRule<T> {
    check(claim: unknown): boolean {
        return claim !== undefined;
    }

    message(name: string): string[] {
        return [`The '${name}' must be defined.`];
    }
}
