import { Required, Defined, KeyOf, IsArray, NotNull } from '../../src/rules';
import { IsString, IsNumber, IsBoolean } from '../../src/rules';
import { NotEmpty, Regex, In, NotIn, Min, Max } from '../../src/rules';

test('must_be_required', () => {
    const required = new Required();
    expect(required.check({ id: null }['id'])).toBe(false);
    expect(required.check({ id: undefined }['id'])).toBe(false);
    expect(required.check({ id: 0 }['id'])).toBe(true);
    expect(required.check({ id: '' }['id'])).toBe(true);
    expect(required.check({ id: true }['id'])).toBe(true);
});

test('must_be_defined', () => {
    const defined = new Defined();
    expect(defined.check({ id: undefined }['id'])).toBe(false);
    expect(defined.check({ id: null }['id'])).toBe(true);
});

test('must_be_notNull', () => {
    const defined = new NotNull();
    expect(defined.check({ id: undefined }['id'])).toBe(true);
    expect(defined.check({ id: null }['id'])).toBe(false);
});

test('must_be_isString', () => {
    const isString = new IsString();
    expect(isString.check({ id: undefined }['id'])).toBe(true);
    expect(isString.check({ id: null }['id'])).toBe(true);
    expect(isString.check({ id: '' }['id'])).toBe(true);
    expect(isString.check({ id: 'one' }['id'])).toBe(true);
    expect(isString.check({ id: 1 }['id'])).toBe(false);
    expect(isString.check({ id: {} }['id'])).toBe(false);
});

test('must_be_isBoolean', () => {
    const isBoolean = new IsBoolean();
    expect(isBoolean.check({ id: undefined }['id'])).toBe(true);
    expect(isBoolean.check({ id: null }['id'])).toBe(true);
    expect(isBoolean.check({ id: true }['id'])).toBe(true);
    expect(isBoolean.check({ id: false }['id'])).toBe(true);
    expect(isBoolean.check({ id: '' }['id'])).toBe(false);
    expect(isBoolean.check({ id: 1 }['id'])).toBe(false);
});

test('must_be_isNumber', () => {
    const isNumber = new IsNumber();
    expect(isNumber.check({ id: undefined }['id'])).toBe(true);
    expect(isNumber.check({ id: null }['id'])).toBe(true);
    expect(isNumber.check({ id: 0 }['id'])).toBe(true);
    expect(isNumber.check({ id: 11 }['id'])).toBe(true);
    expect(isNumber.check({ id: '' }['id'])).toBe(false);
    expect(isNumber.check({ id: false }['id'])).toBe(false);
});

test('must_be_isArray', () => {
    const isArray = new IsArray();
    expect(isArray.check({ id: undefined }['id'])).toBe(true);
    expect(isArray.check({ id: null }['id'])).toBe(true);
    expect(isArray.check({ id: [1, 2, 3] }['id'])).toBe(true);
    expect(isArray.check({ id: [] }['id'])).toBe(true);
    expect(isArray.check({ id: '' }['id'])).toBe(false);
    expect(isArray.check({ id: {} }['id'])).toBe(false);
});

test('must_be_notEmpty', () => {
    const notEmpty = new NotEmpty();
    expect(notEmpty.check({ id: undefined }['id'])).toBe(false);
    expect(notEmpty.check({ id: null }['id'])).toBe(false);
    expect(notEmpty.check({ id: '' }['id'])).toBe(false);
    expect(notEmpty.check({ id: [] }['id'])).toBe(false);
    expect(notEmpty.check({ id: 0 }['id'])).toBe(true);
    expect(notEmpty.check({ id: false }['id'])).toBe(true);
    expect(notEmpty.check({ id: {} }['id'])).toBe(true);
});

test('must_be_regex', () => {
    const regex = new Regex(/^\d{5}$/);
    expect(regex.check({ id: undefined }['id'])).toBe(true);
    expect(regex.check({ id: null }['id'])).toBe(true);
    expect(regex.check({ id: 12345 }['id'])).toBe(false);
    expect(regex.check({ id: '12345' }['id'])).toBe(true);
    expect(regex.check({ id: '123' }['id'])).toBe(false);
    expect(regex.check({ id: '' }['id'])).toBe(false);
    expect(regex.check({ id: {} }['id'])).toBe(false);
});

test('must_be_in', () => {
    const x = {};
    const inRule = new In(['', false, 'val', {}, x]);
    expect(inRule.check({ id: undefined }['id'])).toBe(true);
    expect(inRule.check({ id: null }['id'])).toBe(true);
    expect(inRule.check({ id: false }['id'])).toBe(true);
    expect(inRule.check({ id: 'val' }['id'])).toBe(true);
    expect(inRule.check({ id: '' }['id'])).toBe(true);
    expect(inRule.check({ id: {} }['id'])).toBe(false);
    expect(inRule.check({ id: x }['id'])).toBe(true);
    expect(inRule.check({ id: '12345' }['id'])).toBe(false);
    expect(inRule.check({ id: 0 }['id'])).toBe(false);
    expect(inRule.check({ id: 11 }['id'])).toBe(false);
});

test('must_be_notIn', () => {
    const x = {};
    const notIn = new NotIn([null, undefined, '', false, 'val', {}, x]);
    expect(notIn.check({ id: undefined }['id'])).toBe(false);
    expect(notIn.check({ id: null }['id'])).toBe(false);
    expect(notIn.check({ id: false }['id'])).toBe(false);
    expect(notIn.check({ id: 'val' }['id'])).toBe(false);
    expect(notIn.check({ id: '' }['id'])).toBe(false);
    expect(notIn.check({ id: {} }['id'])).toBe(true);
    expect(notIn.check({ id: x }['id'])).toBe(false);
    expect(notIn.check({ id: '12345' }['id'])).toBe(true);
    expect(notIn.check({ id: 0 }['id'])).toBe(true);
    expect(notIn.check({ id: 11 }['id'])).toBe(true);
});

test('must_be_keyOf', () => {
    const inRule = new KeyOf({ id: 1 });
    expect(inRule.check({ name: undefined }['name'])).toBe(true);
    expect(inRule.check({ name: null }['name'])).toBe(true);
    expect(inRule.check({ name: 'id' }['name'])).toBe(true);
    expect(inRule.check({ name: 'foo' }['name'])).toBe(false);
});

test('must_be_min', () => {
    const min = new Min(2);
    expect(min.check({ id: undefined }['id'])).toBe(true);
    expect(min.check({ id: null }['id'])).toBe(true);
    expect(min.check({ id: 0 }['id'])).toBe(false);
    expect(min.check({ id: 2 }['id'])).toBe(true);
    expect(min.check({ id: 11 }['id'])).toBe(true);
    expect(min.check({ id: 'a' }['id'])).toBe(false);
    expect(min.check({ id: 'aa' }['id'])).toBe(true);
    expect(min.check({ id: 'aaa' }['id'])).toBe(true);
});

test('must_be_max', () => {
    const max = new Max(2);
    expect(max.check({ id: undefined }['id'])).toBe(true);
    expect(max.check({ id: null }['id'])).toBe(true);
    expect(max.check({ id: 2 }['id'])).toBe(true);
    expect(max.check({ id: 3 }['id'])).toBe(false);
    expect(max.check({ id: 'aa' }['id'])).toBe(true);
    expect(max.check({ id: 'aaa' }['id'])).toBe(false);
});
