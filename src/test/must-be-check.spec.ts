import { Must, Be, Check, MakeIt } from '..';

enum Pattern {
    Basic = 'Basic',
    Safe = 'Safe',
}

@Must(Be({ strict: true }))
class Model {
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

function CreateModel(
    id?: unknown,
    name?: unknown,
    state?: unknown,
    pattern?: unknown,
    child?: unknown,
    subItems?: unknown,
): Model {
    const model = new Model();
    model.id = id;
    model.name = name;
    model.state = state;
    model.pattern = pattern;
    model.child = child;
    model.subItems = subItems;
    return model;
}

test('must_be_check', () => {
    expect(Check(CreateModel(undefined, 'foo', false, 'Basic')).errors).toEqual(undefined);
    expect(Check(CreateModel(undefined, 'foo', false, 'Base')).errors).toEqual({
        pattern: ["The 'pattern' must be key of 'Basic,Safe'."],
    });
    expect(Check(CreateModel(undefined, 123, false, 'Basic')).errors).toEqual({
        name: ["Type of 'name' must be 'string'."],
    });
    expect(Check(CreateModel(undefined, 123, false)).errors).toEqual({
        name: ["Type of 'name' must be 'string'."],
        pattern: ["The 'pattern' is required."],
    });
});

test('must_be_make_it_check', () => {
    expect(MakeIt(Model, { id: undefined, name: 'foo', state: false, pattern: 'Basic' }).errors).toEqual(undefined);
    expect(MakeIt(Model, { id: undefined, name: 'foo', state: false, pattern: 'Base' }).errors).toEqual({
        pattern: ["The 'pattern' must be key of 'Basic,Safe'."],
    });
    expect(MakeIt(Model, { id: undefined, name: 123, state: false, pattern: 'Basic' }).errors).toEqual({
        name: ["Type of 'name' must be 'string'."],
    });
    expect(MakeIt(Model, { id: undefined, name: 123, state: false }).errors).toEqual({
        name: ["Type of 'name' must be 'string'."],
        pattern: ["The 'pattern' is required."],
    });
    expect(
        MakeIt(Model, {
            id: undefined,
            name: 'foo',
            state: false,
            pattern: 'Basic',
            child: { id: undefined, name: 'foo', state: false, pattern: 123 },
            subItems: [
                { id: undefined, name: 'foo', state: false, pattern: 'Base' },
                { id: undefined, name: 'foo', state: false, pattern: 'Basic' },
                { id: undefined, name: 123, state: false },
            ],
        }).errors,
    ).toEqual({
        child: {
            pattern: ["Type of 'pattern' must be 'string'.", "The 'pattern' must be key of 'Basic,Safe'."],
        },
        subItems: {
            0: { pattern: ["The 'pattern' must be key of 'Basic,Safe'."] },
            2: { name: ["Type of 'name' must be 'string'."], pattern: ["The 'pattern' is required."] },
        },
    });
});

test('must-be-make-array', () => {
    const result1 = MakeIt(Model, [
        { id: undefined, name: 'foo', state: false, pattern: 'Basic' },
        { id: undefined, name: 'bee', state: false, pattern: 'Basic' },
    ]);
    expect(result1.errors).toEqual(undefined);

    const result2 = MakeIt(
        [Model],
        [
            { id: undefined, name: 'foo', state: true, pattern: 'Safe' },
            { id: undefined, name: 'foo', state: true, pattern: 'Base' },
            {
                id: undefined,
                name: 123,
                state: false,
                child: { name: 123, state: false, pattern: 'Base' },
                pattern: 'Safe',
            },
        ],
    );
    expect(result2.errors).toEqual({
        1: { pattern: ["The 'pattern' must be key of 'Basic,Safe'."] },
        2: {
            name: ["Type of 'name' must be 'string'."],
            child: {
                name: ["Type of 'name' must be 'string'."],
                pattern: ["The 'pattern' must be key of 'Basic,Safe'."],
            },
        },
    });
});
