/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from '../rule';

export class Required<T> implements IRule<T> {
    check(claim: unknown, p: string): boolean {
        return (claim as any)[p] !== null && (claim as any)[p] !== undefined;
    }

    message(p: string): string[] {
        return [`Property '${p}' is required.`];
    }
}
