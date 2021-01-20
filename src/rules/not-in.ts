import { IRule } from '../rule';

export class NotIn<T> implements IRule<T> {
    constructor(readonly values: unknown[]) {}

    check(claim: unknown): boolean {
        return this.values.indexOf(claim) === -1;
    }

    message(name: string): string {
        return `The '${name}' must be not include in '${this.values}'.`;
    }
}
