import 'reflect-metadata';
import { Schema } from './schema';
import { RuleMap } from './rule-map';
import { IMap } from './map';
import { exception } from 'console';
import { ClassType } from './class-type';

const MustBeKey = 'MUST:BE:CHECK';

export function Must<T, TRuleMap extends RuleMap<T> = RuleMap<T>>(rm: TRuleMap) {
    return (target: unknown, key?: string): void => {
        const constructor = target.constructor;
        let schema: Schema<T> = Reflect.getMetadata(MustBeKey, constructor);
        // -------------- Class Decorator --------------
        if (!key) {
            if (!schema) {
                schema = new Schema<T>(rm);
                Reflect.defineMetadata(MustBeKey, schema, constructor);
                return;
            }

            throw exception(`Decorator '${MustBeKey}' for classes should be applied first and only once.`);
        }
        // ---------------------------------------------
        // -------------- Property Decorator -----------
        if (!schema) {
            schema = new Schema<T>();
        }
        if (schema.has(key)) {
            throw exception(`Decorator '${MustBeKey}' can only be applied once to '${key.toString}'`);
        }
        schema.set(key, rm);
        Reflect.defineMetadata(MustBeKey, schema, constructor);
        // ---------------------------------------------
    };
}

export function Be<T>(map?: IMap): RuleMap<T> {
    return new RuleMap<T>(map);
}

export function Check<T>(
    claim: T,
): {
    pass: boolean;
    errors: string[];
} {
    const errors = GetSchema(claim.constructor)?.check(claim) ?? [];
    return {
        pass: errors.length === 0,
        errors,
    };
}

export function MakeItCheck<T>(
    constructor: ClassType,
    pool: unknown,
    ...args: unknown[]
): { made: T; pass: boolean; errors: string[] } {
    const schema = GetSchema<T>(constructor);
    if (!schema) {
        const made = constructor ? <T>new constructor(...args) : undefined;
        return { made, pass: true, errors: [] };
    }
    const result = schema.make<T>(constructor, pool, ...args);
    return { made: result.made, pass: result.errors.length === 0, errors: result.errors };
}

export function GetSchema<T>(constructor: unknown): Schema<T> {
    return <Schema<T>>Reflect.getMetadata(MustBeKey, constructor);
}
