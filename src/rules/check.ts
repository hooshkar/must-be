/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from '../rule';
import { MustBeCheck } from '../must-be';

export class Check<T> implements IRule<T> {
    private errors!: string[];

    check(claim: unknown, p: string | symbol): boolean {
        if ((claim as any)[p] === null || (claim as any)[p] === undefined) {
            return true;
        }

        const result = MustBeCheck((claim as any)[p]);
        this.errors = result.errors;
        return result.pass;
    }

    message(): string[] {
        return this.errors || [];
    }
}
