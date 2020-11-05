import { IRule } from "../rule";

export class Min<T extends any> implements IRule<T> {
    constructor(readonly min: number) {
    }

    check(claim: any, p: string): boolean {

        if (typeof claim[p] !== "number") {
            return true;
        }

        return (claim[p] as number) >= this.min;
    }

    message(p: string): string[] {
        return [`Minimum value of property '${p}' is '${this.min}'.`];
    }
}
