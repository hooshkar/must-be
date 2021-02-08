import { Required, Defined, KeyOf, NotNull, Exist } from './rules';
import { IsString, IsNumber, IsBoolean, IsArray } from './rules';
import { NotEmpty, Regex, In, NotIn, Min, Max } from './rules';
import { IRule } from './rule';
import { IMap } from './map';
import { Nested } from './nested';
import { ICondition, If } from './Condition';
import { AddError } from './add-error';

export class RuleMap<T = unknown> {
    private readonly _rules: IRule<T>[] = [];
    private readonly _conditions: ICondition<T>[] = [];
    private readonly _map?: IMap;

    constructor(map?: IMap) {
        this._map = map;
    }

    get map(): IMap {
        return this._map;
    }

    check(claim: unknown, pool: T, property: string, errKey: string, errors: Nested): void {
        const err: string[] = [];
        for (let i = 0; i < this._rules.length; i++) {
            const r = this._rules[i];
            if (!r.check(claim, pool, property, this.map)) {
                err.push(r.message(property ?? 'claim'));
            }
        }

        this._conditions.forEach((c) => {
            if (c.if._rules.every((r) => !r.check(claim, pool, property, this.map))) {
                if (c.else) {
                    c.else.check(claim, pool, property, errKey, errors);
                }
            } else {
                if (c.then) {
                    c.then.check(claim, pool, property, errKey, errors);
                }
            }
        });

        if (err.length > 0) {
            AddError(errors, errKey, err);
        }
    }

    conditional(condition: ICondition<T>): void {
        if (this._conditions.indexOf(condition) != -1) {
            throw new Error('the condition has already been added.');
        }
        this._conditions.push(condition);
    }

    if(rm: RuleMap<T>): If<T> {
        return new If(this, rm);
    }

    exist(): this {
        this._rules.push(new Exist());
        return this;
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
