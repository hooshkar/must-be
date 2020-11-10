import { Required, Defined, KeyOf } from "./rules";
import { IsString, IsNumber, IsBoolean } from "./rules";
import { NotEmpty, Regex, In, NotIn } from "./rules";
import { Min, Max, MinChar, MaxChar } from "./rules";
import { IRule } from "./rule";
import { Check } from "./rules/check";

export class RuleMap<T> {
  private readonly _rules: IRule<T>[] = [];
  get rules(): IRule<T>[] {
    return this._rules;
  }

  defined(): RuleMap<T> {
    this._rules.push(new Defined());
    return this;
  }

  check(): RuleMap<T> {
    this._rules.push(new Check());
    return this;
  }

  required(): RuleMap<T> {
    this._rules.push(new Required());
    return this;
  }

  notEmpty(): RuleMap<T> {
    this._rules.push(new NotEmpty());
    return this;
  }

  isString(): RuleMap<T> {
    this._rules.push(new IsString());
    return this;
  }

  isNumber(): RuleMap<T> {
    this._rules.push(new IsNumber());
    return this;
  }

  isBoolean(): RuleMap<T> {
    this._rules.push(new IsBoolean());
    return this;
  }

  regex(pattern: RegExp): RuleMap<T> {
    this._rules.push(new Regex(pattern));
    return this;
  }

  min(min: number): RuleMap<T> {
    this._rules.push(new Min(min));
    return this;
  }

  max(max: number): RuleMap<T> {
    this._rules.push(new Max(max));
    return this;
  }

  minChar(minChar: number): RuleMap<T> {
    this._rules.push(new MinChar(minChar));
    return this;
  }

  maxChar(maxChar: number): RuleMap<T> {
    this._rules.push(new MaxChar(maxChar));
    return this;
  }

  in(...values: unknown[]): RuleMap<T> {
    this._rules.push(new In(values));
    return this;
  }

  notIn(...values: unknown[]): RuleMap<T> {
    this._rules.push(new NotIn(values));
    return this;
  }

  keyOf(pattern: unknown): RuleMap<T> {
    this._rules.push(new KeyOf(pattern));
    return this;
  }
}
