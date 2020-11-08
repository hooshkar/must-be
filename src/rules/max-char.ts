import { IRule } from "../rule";

export class MaxChar<T extends any> implements IRule<T> {
  constructor(readonly maxChar: number) {}

  check(claim: any, p: string): boolean {
    if (typeof claim[p] !== "string") {
      return true;
    }

    return (claim[p] as string).length <= this.maxChar;
  }

  message(p: string): string[] {
    return [`Maximum character of property '${p}' is '${this.maxChar}'.`];
  }
}
