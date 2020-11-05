import "reflect-metadata";
import { Exception, argsNoUndefined } from "basecript";
import { Schema } from "./schema";
import { RuleMap } from "./rule-map";
import { CheckResult } from "./check-result";

const MustBeKey: string = "MUST:BE:CHECK";

export function Must<T = any, TRuleMap extends RuleMap<T> = RuleMap<T>>(map: TRuleMap) {
    return (target: Object, key: string | symbol) => {
        if (argsNoUndefined(arguments) > 2) {
            throw new Exception(`Decorator '${MustBeKey}' is for properties only.`);
        }
        const constructor = target.constructor;
        let schema: (Schema<T> | undefined) = Reflect.getMetadata(MustBeKey, constructor);
        if (schema === undefined) schema = new Schema<T>();
        if (schema.has(key)) {
            throw new Exception(`Decorator '${MustBeKey}' can only be applied once to '${key.toString}'`);
        } else {
            schema.set(key, map);
            Reflect.defineMetadata(MustBeKey, schema, constructor);
        }
    };
}

export function MustBeStrict<T = any>(constructor: T) {
    let schema: (Schema<T> | undefined) = Reflect.getMetadata(MustBeKey, constructor);
    if (schema === undefined) schema = new Schema<T>();
    schema.strict();
    Reflect.defineMetadata(MustBeKey, schema, constructor);
    return constructor;
}

export function Be<T>(): RuleMap<T> {
    return new RuleMap<T>();
}

export function MustBeCheck<T>(claim: T): CheckResult {

    if (claim === null || claim === undefined) {
        throw new Exception("The 'claim' couldn't null or undefined.");
    }

    const errors: string[] = [];
    const schema: (Schema<T> | undefined) = Reflect.getMetadata(MustBeKey, (claim as any).constructor);
    if (schema) errors.push(...schema.check(claim));
    return {
        pass: errors.length === 0,
        errors,
    };
}
