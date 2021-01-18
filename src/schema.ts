import { exception } from 'console';
import { ClassType } from './class-type';
import { GetSchema } from './must-be-check';
import { RuleMap } from './rule-map';

export class Schema<T> {
    private readonly _rms: Map<string, RuleMap> = new Map<string, RuleMap>();

    constructor(public readonly rm?: RuleMap) {}

    has(key: string): boolean {
        return this._rms.has(key);
    }

    set(key: string, rm: RuleMap<T>): void {
        this._rms.set(key, rm);
    }

    check(claim: T[]): string[];
    check(claim: T): string[];
    check(claim: T[] | T): string[];
    check(claim: T[] | T): string[] {
        if (Array.isArray(claim)) {
            let schema = GetSchema<T>(claim[0]?.constructor);
            if (!schema) {
                schema = new Schema();
            }
            const errors: string[] = [];
            claim.forEach((c) => {
                errors.push(...schema.check(c));
            });
            if (this.rm) {
                errors.push(...this.rm.check(claim, 'claim'));
            }
            return errors;
        }
        const errors: string[] = [];
        if (this.rm?.map?.strict) {
            Object.keys(claim).forEach((k) => {
                if (!this.has(k)) errors.push(`Property '${k}' is additional.`);
            });
        }
        this._rms.forEach((rm, p) => {
            errors.push(...rm.check(claim[p], p));
        });
        if (this.rm) {
            errors.push(...this.rm.check(claim, 'claim'));
        }
        return errors;
    }

    make<T>(constructor: [ClassType], pool: unknown): { made: T[]; errors: string[] };
    make<T>(constructor: ClassType, pool: unknown): { made: T; errors: string[] };
    make<T>(constructor: ClassType | [ClassType<T>], pool: unknown): { made: T[] | T; errors: string[] };
    make<T>(constructor: ClassType | [ClassType<T>], pool: unknown): { made: T[] | T; errors: string[] } {
        if (!constructor) {
            throw exception(`The 'constructor' parameter is required to make it.`);
        }
        if (typeof constructor == 'object') {
            return this.array(constructor, pool);
        }
        if (constructor === String || constructor === Number || constructor === Boolean) {
            return this.preparing(this.rm, pool, 'pool');
        }
        if (typeof pool !== 'object' || Array.isArray(pool)) {
            return this.preparing(this.rm, pool, 'pool');
        }
        const made: T = <T>new constructor();
        if (Array.isArray(made)) {
            throw exception(
                `The 'constructor' parameter must be not an array type. Please use the [ClassType] for array type.`,
            );
        }
        const keys: string[] = [];
        keys.push(...this._rms.keys());
        if (pool && !this.rm?.map?.strict) {
            keys.push(...Object.keys(pool).filter((k) => !keys.includes(k)));
        }
        const errors: string[] = [];
        keys.forEach((key) => {
            const rm = this._rms.get(key);
            const map = rm?.map;
            const property = map?.key ? map.key : key;
            const value = pool ? pool[property] : undefined;
            const cv = this.preparing(rm, value, property);
            made[key] = cv.made;
            errors.push(...cv.errors);
        });

        if (this.rm) {
            errors.push(...this.rm.check(made, 'made'));
        }
        return { made, errors };
    }

    private array<T>(constructor: [ClassType], pool: unknown): { made: T[]; errors: string[] } {
        if (!Array.isArray(pool)) {
            throw new exception('If you want make an array type, please use an array data for pool.');
        }
        let schema = GetSchema<T>(constructor[0]);
        if (!schema) {
            schema = new Schema();
        }
        const errors: string[] = [];
        const made: T[] = [];
        pool.forEach((p) => {
            const result = schema.make<T>(constructor[0], p);
            errors.push(...result.errors);
            made.push(result.made);
        });
        return { made, errors };
    }

    private preparing<T>(rm: RuleMap, value: unknown, name: string): { made: T; errors: string[] } {
        const errors: string[] = [];
        switch (rm?.map?.nested?.mode) {
            case 'array': {
                if (Array.isArray(value)) {
                    const schema = GetSchema(rm.map.nested.type);
                    if (schema) {
                        value = value.map((p) => {
                            const m = this.make<T>(rm.map.nested.type, p);
                            errors.push(...m.errors);
                            return m.made;
                        });
                    }
                }
                break;
            }
            case 'object': {
                const schema = GetSchema(rm.map.nested.type);
                if (schema) {
                    const result = schema.make(rm.map.nested.type, value);
                    value = result.made;
                    errors.push(...result.errors);
                }
                break;
            }
        }
        if (rm?.map?.default && !value) {
            value = rm.map.default;
        }
        if (rm) {
            errors.push(...rm.check(value, name));
        }
        return { made: <T>value, errors };
    }
}
