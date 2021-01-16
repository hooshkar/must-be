import { Must, Be, Check, MakeItCheck } from '../../src';

enum Pattern {
    Basic = 'Basic',
    Safe = 'Safe',
}

@Must(Be({ strict: true }))
class Model {
    constructor(id?: unknown, name?: unknown, state?: unknown, pattern?: unknown) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.pattern = pattern;
    }
    @Must(Be())
    id?: unknown;
    @Must(Be().isString())
    name?: unknown;
    @Must(Be().required().isBoolean())
    state?: unknown;
    @Must(Be({ nested: { mode: 'object', type: Model } }))
    child?: unknown;
    @Must(Be().required().isString().keyOf(Pattern))
    pattern?: unknown;
    @Must(Be({ nested: { mode: 'array', type: Model } }).isArray())
    subItems?: unknown;
}

test('must_be_check', () => {
    expect(Check(new Model(undefined, '123', false, 'Basic')).errors).toEqual([]);
    expect(Check(new Model(undefined, '123', false, 'Base')).errors).toEqual([
        "The 'pattern' must be key of 'Basic,Safe'.",
    ]);
    expect(Check(new Model(undefined, 123, false, 'Basic')).errors).toEqual(["Type of 'name' must be 'string'."]);
    expect(Check(new Model(undefined, 123, false)).errors).toEqual([
        "Type of 'name' must be 'string'.",
        "The 'pattern' is required.",
    ]);
});

test('must_be_make_it_check', () => {
    expect(MakeItCheck(Model, { id: undefined, name: '123', state: false, pattern: 'Basic' }).errors).toEqual([]);
    expect(MakeItCheck(Model, { id: undefined, name: '123', state: false, pattern: 'Base' }).errors).toEqual([
        "The 'pattern' must be key of 'Basic,Safe'.",
    ]);
    expect(MakeItCheck(Model, { id: undefined, name: 123, state: false, pattern: 'Basic' }).errors).toEqual([
        "Type of 'name' must be 'string'.",
    ]);
    expect(MakeItCheck(Model, { id: undefined, name: 123, state: false }).errors).toEqual([
        "Type of 'name' must be 'string'.",
        "The 'pattern' is required.",
    ]);
    expect(
        MakeItCheck(Model, {
            id: undefined,
            name: '123',
            state: false,
            pattern: 'Basic',
            subItems: [
                { id: undefined, name: '123', state: false, pattern: 'Base' },
                { id: undefined, name: 123, state: false, pattern: 'Basic' },
                { id: undefined, name: 123, state: false },
            ],
        }).errors,
    ).toEqual([
        "The 'pattern' must be key of 'Basic,Safe'.",
        "Type of 'name' must be 'string'.",
        "Type of 'name' must be 'string'.",
        "The 'pattern' is required.",
    ]);
});
