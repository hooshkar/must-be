import { RuleMap } from './rule-map';

export interface ICondition<T> {
    if: RuleMap<T>;
    then?: RuleMap<T>;
    else?: RuleMap<T>;
}

function MustNotHaveMap(rm: RuleMap): void {
    if (rm.map) {
        throw new Error("please use 'Be' without 'Map' in 'If' statement.");
    }
}

export class If<T> {
    private readonly condition: ICondition<T>;
    constructor(private readonly base: RuleMap<T>, rm: RuleMap<T>) {
        MustNotHaveMap(rm);
        this.condition = { if: rm };
    }
    then(rm: RuleMap<T>): Then<T> {
        MustNotHaveMap(rm);
        this.condition.then = rm;
        return new Then<T>(this.base, this.condition);
    }
    else(rm: RuleMap<T>): Else<T> {
        MustNotHaveMap(rm);
        this.condition.else = rm;
        return new Else<T>(this.base, this.condition);
    }
}

class Then<T> {
    constructor(private readonly base: RuleMap<T>, private readonly condition: ICondition<T>) {}
    else(rm: RuleMap<T>): Else<T> {
        MustNotHaveMap(rm);
        this.condition.else = rm;
        return new Else<T>(this.base, this.condition);
    }
    end(): RuleMap<T> {
        this.base.conditional(this.condition);
        return this.base;
    }
}

class Else<T> {
    constructor(private readonly base: RuleMap<T>, private readonly condition: ICondition<T>) {}
    end(): RuleMap<T> {
        this.base.conditional(this.condition);
        return this.base;
    }
}
