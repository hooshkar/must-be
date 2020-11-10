/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from "../rule";

export class Defined<T> implements IRule<T> {
  check(claim: unknown, p: string): boolean {
    return (claim as any)[p] !== undefined;
  }

  message(p: string): string[] {
    return [`Property '${p}' must be defined.`];
  }
}
