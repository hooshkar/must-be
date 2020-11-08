import { Required, Defined } from "./rules";
import { IsString, IsNumber, IsBoolean } from "./rules";
import { NotEmpty, Regex, In, NotIn } from "./rules";
import { Min, Max, MinChar, MaxChar } from "./rules";

test("must be required", () => {
  const required = new Required();
  expect(required.check({}, "id")).toBe(false);
  expect(required.check({ id: null }, "id")).toBe(false);
  expect(required.check({ id: undefined }, "id")).toBe(false);
  expect(required.check({ id: 0 }, "id")).toBe(true);
  expect(required.check({ id: "" }, "id")).toBe(true);
});

test("must be defined", () => {
  const defined = new Defined();
  expect(defined.check({}, "id")).toBe(false);
  expect(defined.check({ id: undefined }, "id")).toBe(false);
  expect(defined.check({ id: null }, "id")).toBe(true);
});

test("must be isString", () => {
  const isString = new IsString();
  expect(isString.check({}, "id")).toBe(true);
  expect(isString.check({ id: undefined }, "id")).toBe(true);
  expect(isString.check({ id: null }, "id")).toBe(true);
  expect(isString.check({ id: "" }, "id")).toBe(true);
  expect(isString.check({ id: "one" }, "id")).toBe(true);
  expect(isString.check({ id: 1 }, "id")).toBe(false);
  expect(isString.check({ id: true }, "id")).toBe(false);
});

test("must be isBoolean", () => {
  const isBoolean = new IsBoolean();
  expect(isBoolean.check({}, "id")).toBe(true);
  expect(isBoolean.check({ id: undefined }, "id")).toBe(true);
  expect(isBoolean.check({ id: null }, "id")).toBe(true);
  expect(isBoolean.check({ id: true }, "id")).toBe(true);
  expect(isBoolean.check({ id: false }, "id")).toBe(true);
  expect(isBoolean.check({ id: "" }, "id")).toBe(false);
  expect(isBoolean.check({ id: 1 }, "id")).toBe(false);
});

test("must be isNumber", () => {
  const isNumber = new IsNumber();
  expect(isNumber.check({}, "id")).toBe(true);
  expect(isNumber.check({ id: undefined }, "id")).toBe(true);
  expect(isNumber.check({ id: null }, "id")).toBe(true);
  expect(isNumber.check({ id: 0 }, "id")).toBe(true);
  expect(isNumber.check({ id: 11 }, "id")).toBe(true);
  expect(isNumber.check({ id: "" }, "id")).toBe(false);
  expect(isNumber.check({ id: false }, "id")).toBe(false);
});

test("must be notEmpty", () => {
  const notEmpty = new NotEmpty();
  expect(notEmpty.check({}, "id")).toBe(false);
  expect(notEmpty.check({ id: undefined }, "id")).toBe(false);
  expect(notEmpty.check({ id: null }, "id")).toBe(false);
  expect(notEmpty.check({ id: 0 }, "id")).toBe(false);
  expect(notEmpty.check({ id: "" }, "id")).toBe(false);
  expect(notEmpty.check({ id: 11 }, "id")).toBe(true);
  expect(notEmpty.check({ id: false }, "id")).toBe(true);
  expect(notEmpty.check({ id: "val" }, "id")).toBe(true);
});

test("must be regex", () => {
  const regex = new Regex(/^\d{5}$/);
  expect(regex.check({}, "id")).toBe(true);
  expect(regex.check({ id: undefined }, "id")).toBe(true);
  expect(regex.check({ id: null }, "id")).toBe(true);
  expect(regex.check({ id: 0 }, "id")).toBe(true);
  expect(regex.check({ id: 11 }, "id")).toBe(true);
  expect(regex.check({ id: false }, "id")).toBe(true);
  expect(regex.check({ id: "12345" }, "id")).toBe(true);
  expect(regex.check({ id: "" }, "id")).toBe(false);
  expect(regex.check({ id: "val" }, "id")).toBe(false);
});

test("must be in", () => {
  const inRule = new In([null, undefined, "", false, "val"]);
  expect(inRule.check({}, "id")).toBe(true);
  expect(inRule.check({ id: undefined }, "id")).toBe(true);
  expect(inRule.check({ id: null }, "id")).toBe(true);
  expect(inRule.check({ id: false }, "id")).toBe(true);
  expect(inRule.check({ id: "val" }, "id")).toBe(true);
  expect(inRule.check({ id: "" }, "id")).toBe(true);
  expect(inRule.check({ id: "12345" }, "id")).toBe(false);
  expect(inRule.check({ id: 0 }, "id")).toBe(false);
  expect(inRule.check({ id: 11 }, "id")).toBe(false);
});

test("must be notIn", () => {
  const notIn = new NotIn([null, undefined, "", false, "val"]);
  expect(notIn.check({}, "id")).toBe(false);
  expect(notIn.check({ id: undefined }, "id")).toBe(false);
  expect(notIn.check({ id: null }, "id")).toBe(false);
  expect(notIn.check({ id: false }, "id")).toBe(false);
  expect(notIn.check({ id: "val" }, "id")).toBe(false);
  expect(notIn.check({ id: "" }, "id")).toBe(false);
  expect(notIn.check({ id: "12345" }, "id")).toBe(true);
  expect(notIn.check({ id: 0 }, "id")).toBe(true);
  expect(notIn.check({ id: 11 }, "id")).toBe(true);
});

test("must be min", () => {
  const min = new Min(2);
  expect(min.check({}, "id")).toBe(true);
  expect(min.check({ id: undefined }, "id")).toBe(true);
  expect(min.check({ id: null }, "id")).toBe(true);
  expect(min.check({ id: 0 }, "id")).toBe(false);
  expect(min.check({ id: 2 }, "id")).toBe(true);
  expect(min.check({ id: 11 }, "id")).toBe(true);
});

test("must be max", () => {
  const max = new Max(2);
  expect(max.check({}, "id")).toBe(true);
  expect(max.check({ id: undefined }, "id")).toBe(true);
  expect(max.check({ id: null }, "id")).toBe(true);
  expect(max.check({ id: 2 }, "id")).toBe(true);
  expect(max.check({ id: 3 }, "id")).toBe(false);
});

test("must be minChar", () => {
  const minChar = new MinChar(2);
  expect(minChar.check({}, "id")).toBe(true);
  expect(minChar.check({ id: undefined }, "id")).toBe(true);
  expect(minChar.check({ id: null }, "id")).toBe(true);
  expect(minChar.check({ id: 3 }, "id")).toBe(true);
  expect(minChar.check({ id: "a" }, "id")).toBe(false);
  expect(minChar.check({ id: "aa" }, "id")).toBe(true);
  expect(minChar.check({ id: "aaa" }, "id")).toBe(true);
});

test("must be maxChar", () => {
  const maxChar = new MaxChar(2);
  expect(maxChar.check({}, "id")).toBe(true);
  expect(maxChar.check({ id: undefined }, "id")).toBe(true);
  expect(maxChar.check({ id: null }, "id")).toBe(true);
  expect(maxChar.check({ id: 3 }, "id")).toBe(true);
  expect(maxChar.check({ id: "aa" }, "id")).toBe(true);
  expect(maxChar.check({ id: "aaa" }, "id")).toBe(false);
});
