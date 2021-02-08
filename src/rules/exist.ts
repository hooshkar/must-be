import { IRule } from '../rule';

export class Exist<T> implements IRule<T> {
    check(claim: unknown, pool: T, property: string): boolean {
        if (!pool || !property) {
            throw new Error("please use the 'exist' rule only in properties.");
        }
        return Object.keys(pool).indexOf(property) != -1;
    }

    message(name: string): string {
        return `The '${name}' must be exist.`;
    }
}
