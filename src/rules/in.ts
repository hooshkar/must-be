import { IRule } from "../rule";

export class In<T extends any> implements IRule<T> {
    constructor(readonly values: any[]) {
    }

    check(claim: any, p: string): boolean {
        return this.values.indexOf(claim[p]) !== -1;
    }

    message(p: string): string[] {
        return [`Property '${p}' have a invalid value.`];
    }
}
