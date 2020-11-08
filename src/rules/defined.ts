import { IRule } from "../rule";

export class Defined<T extends any> implements IRule<T> {
  check(claim: any, p: string): boolean {
    return claim[p] !== undefined;
  }

  message(p: string): string[] {
    return [`Property '${p}' must be defined.`];
  }
}
