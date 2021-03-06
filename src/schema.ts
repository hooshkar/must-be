import { AddError } from './add-error';
import { ClassType } from './class-type';
import { Nested } from './nested';
import { GetSchema } from './must-be-check';
import { RuleMap } from './rule-map';

export class Schema<T> {
    private readonly _rms: Map<string, RuleMap<T>> = new Map<string, RuleMap<T>>();
    private _rm?: RuleMap<T>;

    has(key: string): boolean {
        return this._rms.has(key);
    }

    set(key: string, rm: RuleMap<T>): void {
        if (key) {
            this._rms.set(key, rm);
        } else {
            this._rm = rm;
        }
    }

    check(claim: T[]): { [key: number]: Nested };
    check(claim: T): { [key: string]: Nested };
    check(claim: T[] | T): Nested;
    check(claim: T[] | T): Nested {
        if (Array.isArray(claim)) {
            return this.checkArray(claim[0].constructor, claim);
        }
        const errors = {};
        if (claim) {
            this._rms.forEach((rm, p) => {
                switch (rm?.map?.nested?.mode) {
                    case 'array': {
                        const err = {};
                        if (Array.isArray(claim[p])) {
                            const schema = GetSchema<T>(rm.map.nested.type);
                            for (let i = 0; i < claim[p].length; i++) {
                                const c = claim[p][i];
                                const r = schema.check(c);
                                AddError(err, i, r);
                            }
                        }
                        rm.check(claim[p], claim, p, undefined, err);
                        AddError(errors, p, err);
                        break;
                    }
                    case 'object': {
                        const schema = GetSchema(rm.map.nested.type);
                        const err = schema.check(claim[p]);
                        rm.check(claim[p], claim, p, undefined, err);
                        AddError(errors, p, err);
                        break;
                    }
                    default: {
                        rm.check(claim[p], claim, p, p, errors);
                        break;
                    }
                }
            });
            if (this._rm?.map?.strict) {
                Object.keys(claim).forEach((k) => {
                    if (!this.has(k)) {
                        AddError(errors, k, [`Property '${k}' is additional.`]);
                    }
                });
            }
        }
        if (this._rm) {
            this._rm.check(claim, undefined, undefined, undefined, errors);
        }
        return errors;
    }

    private checkArray(constructor: unknown, claim: T[]): Nested {
        const schema = GetSchema<T>(constructor);
        const errors = {};
        for (let i = 0; i < claim.length; i++) {
            const c = claim[i];
            const r = schema.check(c);
            AddError(errors, i, r);
        }
        if (this._rm) {
            this._rm.check(claim, undefined, undefined, undefined, errors);
        }
        return errors;
    }

    make<T>(constructor: [ClassType], pool: unknown): { made: T[]; errors: { [key: number]: Nested } };
    make<T>(constructor: ClassType, pool: unknown): { made: T; errors: { [key: string]: Nested } };
    make<T>(constructor: ClassType | [ClassType], pool: unknown): { made: T[] | T; errors: Nested };
    make<T>(constructor: ClassType | [ClassType], pool: unknown): { made: T[] | T; errors: Nested } {
        if (!constructor) {
            throw new Error(`The 'constructor' parameter is required to make it.`);
        }
        if (typeof constructor == 'object') {
            return this.MakeArray(constructor, pool);
        }
        if (constructor === String || constructor === Number || constructor === Boolean) {
            const errors = {};
            const made = this.makeProperty<T>(this._rm, pool, undefined, undefined, errors);
            return { made, errors };
        }
        if (typeof pool !== 'object' || Array.isArray(pool)) {
            const errors = {};
            const made = this.makeProperty<T>(this._rm, pool, undefined, undefined, errors);
            return { made, errors };
        }
        const made: T = <T>new constructor();
        if (Array.isArray(made)) {
            throw new Error(
                `The 'constructor' parameter must be not an array type. Please use the [ClassType] for array type.`,
            );
        }
        const errors = {};
        const keys: string[] = [];
        const poolKeys = Object.keys(pool);
        keys.push(...this._rms.keys());
        if (pool) {
            const additional = poolKeys.filter((k) => !keys.includes(k));
            if (additional.length > 0) {
                if (this._rm?.map?.strict) {
                    additional.forEach((k) => {
                        AddError(errors, k, [`Property '${k}' is additional.`]);
                    });
                } else {
                    keys.push(...additional);
                }
            }
        }
        keys.forEach((key) => {
            const rm = this._rms.get(key);
            const map = rm?.map;
            const property = map?.key ? map.key : key;
            const value = this.makeProperty(rm, pool, property, property, errors);
            if (value !== undefined || poolKeys.indexOf(property) !== -1) {
                made[key] = value;
            }
        });

        if (this._rm) {
            this._rm.check(made, undefined, undefined, undefined, errors);
        }
        return { made, errors };
    }

    private MakeArray<T>(constructor: [ClassType], pool: unknown): { made: T[]; errors: Nested } {
        if (!Array.isArray(pool)) {
            throw new Error('If you want make an array type, please use an array data for pool.');
        }
        const schema = GetSchema<T>(constructor[0]);
        const errors = {};
        const made: T[] = [];
        for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            const result = schema.make<T>(constructor[0], p);
            AddError(errors, i, result.errors);
            made.push(result.made);
        }
        if (this._rm) {
            this._rm.check(made, undefined, undefined, undefined, errors);
        }
        return { made, errors };
    }

    private makeProperty<T>(rm: RuleMap, pool: unknown, name: string, errKey: string, errors: Nested): T {
        let value = pool && name ? pool[name] : undefined;
        switch (rm?.map?.nested?.mode) {
            case 'array': {
                if (Array.isArray(value)) {
                    const schema = GetSchema(rm.map.nested.type);
                    const val: T[] = [];
                    const err = {};
                    for (let i = 0; i < value.length; i++) {
                        const p = value[i];
                        const m = schema.make<T>(rm.map.nested.type, p);
                        AddError(err, i, m.errors);
                        val.push(m.made);
                    }
                    value = val;
                    if (rm?.map?.default && !value) {
                        value = rm.map.default;
                    }
                    rm.check(value, pool, name, errKey, err);
                    AddError(errors, name, err);
                }
                break;
            }
            case 'object': {
                const schema = GetSchema(rm.map.nested.type);
                const result = schema.make(rm.map.nested.type, value);
                value = result.made;
                const err = result.errors;
                if (rm?.map?.default && !value) {
                    value = rm.map.default;
                }
                rm.check(value, pool, name, errKey, err);
                AddError(errors, name, err);
                break;
            }
            default: {
                if (rm?.map?.default && !value) {
                    value = rm.map.default;
                }
                if (rm) {
                    rm.check(value, pool, name, errKey, errors);
                }
                break;
            }
        }
        return <T>value;
    }
}
