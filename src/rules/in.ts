/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from "../rule";

export class In<T> implements IRule<T> {
  constructor(readonly values: T[]) {}

  check(claim: unknown, p: string): boolean {
    return this.values.indexOf((claim as any)[p]) !== -1;
  }

  message(p: string): string[] {
    return [`Property '${p}' have a invalid value.`];
  }
}
