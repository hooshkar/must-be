import { IRule } from "../rule";

export class IsString<T extends any> implements IRule<T> {
  check(claim: any, p: string): boolean {
    if (claim[p] === null || claim[p] === undefined) {
      return true;
    }

    return typeof claim[p] === "string";
  }

  message(p: string): string[] {
    return [`Type of property '${p}' must be 'string'.`];
  }
}
