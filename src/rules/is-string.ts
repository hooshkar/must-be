/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from '../rule';

export class IsString<T> implements IRule<T> {
    check(claim: unknown, p: string): boolean {
        if ((claim as any)[p] === null || (claim as any)[p] === undefined) {
            return true;
        }

        return typeof (claim as any)[p] === 'string';
    }

    message(p: string): string[] {
        return [`Type of property '${p}' must be 'string'.`];
    }
}
