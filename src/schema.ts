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

    check(claim: T): string[] {
        const errors: string[] = [];
        if (this.rm?.map?.strict) {
            Object.keys(claim).forEach((k) => {
                if (!this.has(k)) errors.push(`Property '${k}' is additional.`);
            });
        }
        this._rms.forEach((rm, p) => {
            errors.push(...rm.check(claim[p], p));
        });
        return errors;
    }

    make<T>(constructor: ClassType, pool: unknown, ...args: unknown[]): { made: T; errors: string[] } {
        if (!constructor) {
            throw exception(`The 'constructor' parameter is required to make it.`);
        }
        if (constructor === String || constructor === Number || constructor === Boolean) {
            return this.preparing(this.rm, pool, 'pool');
        }
        const made: T = <T>new constructor(...args);
        if (Array.isArray(made)) {
            return this.preparing(this.rm, pool, 'pool');
        }
        if (typeof pool !== 'object' || Array.isArray(pool)) {
            return this.preparing(this.rm, made, 'made');
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

    private preparing<T>(rm: RuleMap, value: unknown, name: string): { made: T; errors: string[] } {
        const errors: string[] = [];
        switch (rm?.map?.nested?.mode) {
            case 'array': {
                if (Array.isArray(value)) {
                    const schema = GetSchema(rm.map.nested.type);
                    if (schema) {
                        value = value.map((p) => {
                            const m = this.make<T>(rm.map.nested.type, p, ...(rm.map.nested.args ?? []));
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
                    const result = schema.make(rm.map.nested.type, value, ...(rm.map.nested.args ?? []));
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
