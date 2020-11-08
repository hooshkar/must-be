import { IRule } from "../rule";

export class NotEmpty<T extends any> implements IRule<T> {
  check(claim: any, p: string): boolean {
    return (
      claim[p] !== null &&
      claim[p] !== undefined &&
      claim[p] !== "" &&
      claim[p] !== 0
    );
  }

  message(p: string): string[] {
    return [`Property '${p}' should have a value.`];
  }
}
