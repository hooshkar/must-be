/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from "../rule";

export class Min<T> implements IRule<T> {
  constructor(readonly min: number) {}

  check(claim: unknown, p: string): boolean {
    if (typeof (claim as any)[p] !== "number") {
      return true;
    }

    return ((claim as any)[p] as number) >= this.min;
  }

  message(p: string): string[] {
    return [`Minimum value of property '${p}' is '${this.min}'.`];
  }
}
