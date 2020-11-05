import { IRule } from "../rule";

export class Required<T extends any> implements IRule<T> {
    check(claim: any, p: string): boolean {
        return claim[p] !== null && claim[p] !== undefined;
    }

    message(p: string): string[] {
        return [`Property '${p}' is required.`];
    }
}
