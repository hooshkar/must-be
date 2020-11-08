import { IRule } from "../rule";

export class MinChar<T extends any> implements IRule<T> {
  constructor(readonly minChar: number) {}

  check(claim: any, p: string): boolean {
    if (typeof claim[p] !== "string") {
      return true;
    }

    return (claim[p] as string).length >= this.minChar;
  }

  message(p: string): string[] {
    return [`Minimum character of property '${p}' is '${this.minChar}'.`];
  }
}
