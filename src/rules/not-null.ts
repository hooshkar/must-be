import { IRule } from '../rule';

export class NotNull<T> implements IRule<T> {
    check(claim: unknown): boolean {
        return claim !== null;
    }

    message(name: string): string {
        return `The '${name}' must be not null.`;
    }
}
