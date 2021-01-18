import 'reflect-metadata';
import { Schema } from './schema';
import { RuleMap } from './rule-map';
import { IMap } from './map';
import { ClassType } from './class-type';
import { CheckResult } from './check-result';
import { MakeResult } from './make-result';

const MustBeKey = 'MUST:BE:CHECK';

export function Must<T, TRuleMap extends RuleMap<T> = RuleMap<T>>(rm: TRuleMap) {
    return (target: unknown, key?: string): void => {
        // -------------- Class Decorator --------------
        if (!key) {
            let schema = GetSchema(target);
            if (!schema) {
                schema = new Schema<T>();
            }
            schema.rm = rm;
            Reflect.defineMetadata(MustBeKey, schema, target.constructor);
            return;
        }
        // ---------------------------------------------
        // -------------- Property Decorator -----------
        let schema = GetSchema(target.constructor);
        if (!schema) {
            schema = new Schema<T>();
        }
        if (schema.has(key)) {
            throw new Error(`Decorator '${MustBeKey}' can only be applied once to '${key}'`);
        }
        schema.set(key, rm);
        Reflect.defineMetadata(MustBeKey, schema, target.constructor);
        // ---------------------------------------------
    };
}

export function Be<T>(map?: IMap): RuleMap<T> {
    return new RuleMap<T>(map);
}

export function Check<T>(claim: T[]): CheckResult;
export function Check<T>(claim: T): CheckResult;
export function Check<T>(claim: T[] | T): CheckResult {
    let schema = GetSchema<T>(claim.constructor);
    if (!schema) {
        schema = new Schema();
    }
    const errors = schema.check(claim);
    return {
        pass: errors.length === 0,
        errors,
    };
}

export function MakeIt<T>(constructor: [ClassType<T>], pool: unknown): MakeResult<T[]>;
export function MakeIt<T>(constructor: ClassType<T>, pool: unknown): MakeResult<T>;
export function MakeIt<T>(constructor: ClassType<T> | [ClassType<T>], pool: unknown): MakeResult<T[] | T> {
    let schema = GetSchema<T>(constructor);
    if (!schema) {
        schema = new Schema();
    }
    const result = schema.make<T>(constructor, pool);
    return { made: result.made, pass: result.errors.length === 0, errors: result.errors };
}

export function GetSchema<T>(target: unknown): Schema<T> {
    return <Schema<T>>Reflect.getMetadata(MustBeKey, target);
}
