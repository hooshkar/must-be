/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from "../rule";

export class Regex<T> implements IRule<T> {
  constructor(readonly pattern: RegExp) {}

  check(claim: unknown, p: string): boolean {
    if (typeof (claim as any)[p] !== "string") {
      return true;
    }

    return this.pattern.test((claim as any)[p]);
  }

  message(p: string): string[] {
    return [`Property '${p}' is invalid.`];
  }
}
