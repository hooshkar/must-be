import { RuleMap } from "./rule-map";

export class Schema<T> {
  private readonly _map: Map<string | symbol, RuleMap<T>> = new Map<
    string,
    RuleMap<T>
  >();
  private _strict = false;

  strict(): void {
    this._strict = true;
  }

  has(key: string | symbol): boolean {
    return this._map.has(key);
  }

  set(key: string | symbol, map: RuleMap<T>): void {
    this._map.set(key, map);
  }

  check(claim: T): string[] {
    const errors: string[] = [];
    if (this._strict) {
      Object.keys(claim).forEach((k) => {
        if (!this.has(k)) errors.push(`Property '${k}' is additional.`);
      });
    }
    this._map.forEach((m, p) => {
      m.rules.forEach((r) => {
        if (!r.check(claim, p)) {
          errors.push(...r.message(p.toString()));
        }
      });
    });
    return errors;
  }
}
