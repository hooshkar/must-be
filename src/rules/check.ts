import { IRule } from "../rule";
import { MustBeCheck } from "../must-be";

export class Check<T extends any> implements IRule<T> {
  private errors!: string[];

  check(claim: any, p: string | symbol): boolean {
    if (claim[p] === null || claim[p] === undefined) {
      return true;
    }

    const result = MustBeCheck(claim[p]);
    this.errors = result.errors;
    return result.pass;
  }

  message(p: string | symbol): string[] {
    return this.errors || [];
  }
}
