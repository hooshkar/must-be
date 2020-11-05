import { IRule } from "../rule";

export class Max<T extends any> implements IRule<T> {
    constructor(readonly max: number) {
    }

    check(claim: any, p: string): boolean {

        if (typeof claim[p] !== "number") {
            return true;
        }

        return (claim[p] as number) <= this.max;
    }

    message(p: string): string[] {
        return [`Maximum value of property '${p}' is '${this.max}'.`];
    }
}
