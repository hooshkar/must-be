import { Must, Be, Check, MakeIt } from '..';

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
    expect(Check(new Model(undefined, 'foo', false, 'Basic')).errors).toEqual([]);
    expect(Check(new Model(undefined, 'foo', false, 'Base')).errors).toEqual([
        "The 'pattern' must be key of 'Basic,Safe'.",
    ]);
    expect(Check(new Model(undefined, 123, false, 'Basic')).errors).toEqual(["Type of 'name' must be 'string'."]);
    expect(Check(new Model(undefined, 123, false)).errors).toEqual([
        "Type of 'name' must be 'string'.",
        "The 'pattern' is required.",
    ]);
});

test('must_be_make_it_check', () => {
    expect(MakeIt(Model, { id: undefined, name: 'foo', state: false, pattern: 'Basic' }).errors).toEqual([]);
    expect(MakeIt(Model, { id: undefined, name: 'foo', state: false, pattern: 'Base' }).errors).toEqual([
        "The 'pattern' must be key of 'Basic,Safe'.",
    ]);
    expect(MakeIt(Model, { id: undefined, name: 123, state: false, pattern: 'Basic' }).errors).toEqual([
        "Type of 'name' must be 'string'.",
    ]);
    expect(MakeIt(Model, { id: undefined, name: 123, state: false }).errors).toEqual([
        "Type of 'name' must be 'string'.",
        "The 'pattern' is required.",
    ]);
    expect(
        MakeIt(Model, {
            id: undefined,
            name: 'foo',
            state: false,
            pattern: 'Basic',
            child: { id: undefined, name: 'foo', state: false, pattern: 'Basic' },
            subItems: [
                { id: undefined, name: 'foo', state: false, pattern: 'Base' },
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

test('must-be-make-array', () => {
    const result1 = MakeIt(Model, [
        { id: undefined, name: 'foo', state: false, pattern: 'Basic' },
        { id: undefined, name: 'bee', state: false, pattern: 'Basic' },
    ]);
    expect(result1.errors).toEqual([]);

    const result2 = MakeIt(
        [Model],
        [
            { id: undefined, name: 'foo', state: false, pattern: 'Base' },
            {
                id: undefined,
                name: 123,
                state: false,
                child: { name: 123, state: false, pattern: 'Base' },
                pattern: 'Safe',
            },
        ],
    );
    expect(result2.errors).toEqual([
        "The 'pattern' must be key of 'Basic,Safe'.",
        "Type of 'name' must be 'string'.",
        "Type of 'name' must be 'string'.",
        "The 'pattern' must be key of 'Basic,Safe'.",
    ]);
});
