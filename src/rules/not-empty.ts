/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRule } from "../rule";

export class NotEmpty<T> implements IRule<T> {
  check(claim: unknown, p: string): boolean {
    return (
      (claim as any)[p] !== null &&
      (claim as any)[p] !== undefined &&
      (claim as any)[p] !== "" &&
      (claim as any)[p] !== 0
    );
  }

  message(p: string): string[] {
    return [`Property '${p}' should have a value.`];
  }
}
