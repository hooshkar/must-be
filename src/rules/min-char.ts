/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from "../rule";

export class MinChar<T> implements IRule<T> {
  constructor(readonly minChar: number) {}

  check(claim: unknown, p: string): boolean {
    if (typeof (claim as any)[p] !== "string") {
      return true;
    }

    return ((claim as any)[p] as string).length >= this.minChar;
  }

  message(p: string): string[] {
    return [`Minimum character of property '${p}' is '${this.minChar}'.`];
  }
}
