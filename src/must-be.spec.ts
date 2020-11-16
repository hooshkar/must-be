/* eslint-disable @typescript-eslint/no-explicit-any */
import { Must, Be, MustBeStrict, MustBeCheck } from './index';

@MustBeStrict
class Model {
    constructor(id?: any, name?: any, state?: any, pattern?: any) {
        this.id = id;
        this.name = name;
        this.state = state;
        this.pattern = pattern;
    }
    @Must(Be())
    id?: any;
    @Must(Be().isString())
    name?: any;
    @Must(Be().required().isBoolean())
    state?: any;
    @Must(Be().required().isString())
    pattern?: any;
}

test('must be check', () => {
    expect(MustBeCheck(new Model(undefined, '123', false, 'Base')).errors).toEqual([]);
    expect(MustBeCheck(new Model(undefined, 123, false, 'Base')).errors).toEqual([
        "Type of property 'name' must be 'string'.",
    ]);
    expect(MustBeCheck(new Model(undefined, 123, false)).errors).toEqual([
        "Type of property 'name' must be 'string'.",
        "Property 'pattern' is required.",
    ]);
});
