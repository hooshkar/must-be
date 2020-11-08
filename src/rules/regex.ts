import { IRule } from "../rule";

export class Regex<T extends any> implements IRule<T> {
  constructor(readonly pattern: RegExp) {}

  check(claim: any, p: string): boolean {
    if (typeof claim[p] !== "string") {
      return true;
    }

    return this.pattern.test(claim[p]);
  }

  message(p: string): string[] {
    return [`Property '${p}' is invalid.`];
  }
}
