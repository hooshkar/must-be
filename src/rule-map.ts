import { Required, Defined, KeyOf, NotNull } from './rules';
import { IsString, IsNumber, IsBoolean, IsArray } from './rules';
import { NotEmpty, Regex, In, NotIn, Min, Max } from './rules';
import { IRule } from './rule';
import { IMap } from './map';

export class RuleMap<T = unknown> {
    constructor(public readonly map?: IMap) {}

    private readonly _rules: IRule<T>[] = [];
    get rules(): IRule<T>[] {
        return this._rules;
    }

    check(claim: T, name: string, errors: unknown): void {
        const err: string[] = [];
        for (let i = 0; i < this.rules.length; i++) {
            const r = this.rules[i];
            if (!r.check(claim, this.map)) {
                err.push(r.message(name));
            }
        }
        if (err.length > 0) {
            errors[name] = err;
        }
    }

    defined(): this {
        this._rules.push(new Defined());
        return this;
    }

    notNull(): this {
        this._rules.push(new NotNull());
        return this;
    }

    required(): this {
        this._rules.push(new Required());
        return this;
    }

    notEmpty(): this {
        this._rules.push(new NotEmpty());
        return this;
    }

    isString(): this {
        this._rules.push(new IsString());
        return this;
    }

    isNumber(): this {
        this._rules.push(new IsNumber());
        return this;
    }

    isBoolean(): this {
        this._rules.push(new IsBoolean());
        return this;
    }

    isArray(): this {
        this._rules.push(new IsArray());
        return this;
    }

    regex(pattern: RegExp): this {
        this._rules.push(new Regex(pattern));
        return this;
    }

    min(min: number): this {
        this._rules.push(new Min(min));
        return this;
    }

    max(max: number): this {
        this._rules.push(new Max(max));
        return this;
    }

    in(...values: unknown[]): this {
        this._rules.push(new In(values));
        return this;
    }

    notIn(...values: unknown[]): this {
        this._rules.push(new NotIn(values));
        return this;
    }

    keyOf(pattern: unknown): this {
        this._rules.push(new KeyOf(pattern));
        return this;
    }
}
