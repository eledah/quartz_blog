import { describe, it, expect } from "vitest";
import { parseBasesData } from "../src/parser";
import { lex } from "../src/compiler/lexer";
import { parse } from "../src/compiler/parser";
import type { Expression } from "../src/compiler/ast";

function parseExpression(input: string): Expression {
  return parse(lex(input));
}

function normalizeExpression(node: Expression): unknown {
  switch (node.type) {
    case "Literal":
      return { type: node.type, value: node.value };
    case "Identifier":
      return { type: node.type, name: node.name };
    case "Unary":
      return {
        type: node.type,
        operator: node.operator,
        argument: normalizeExpression(node.argument),
      };
    case "Binary":
      return {
        type: node.type,
        operator: node.operator,
        left: normalizeExpression(node.left),
        right: normalizeExpression(node.right),
      };
    case "Call":
      return {
        type: node.type,
        callee: normalizeExpression(node.callee),
        args: node.args.map((arg) => normalizeExpression(arg)),
      };
    case "Member":
      return {
        type: node.type,
        object: normalizeExpression(node.object),
        property: node.property,
      };
    case "Index":
      return {
        type: node.type,
        object: normalizeExpression(node.object),
        index: normalizeExpression(node.index),
      };
    case "List":
      return {
        type: node.type,
        elements: node.elements.map((element) => normalizeExpression(element)),
      };
  }
}

describe("parseBasesData", () => {
  it("parses basic base YAML", () => {
    const yaml = `
views:
  - type: table
    name: "All Notes"
    order:
      - file.name
      - status
`;
    const data = parseBasesData(yaml);
    expect(data).not.toBeNull();
    if (!data || !data.views) throw new Error("Expected views");
    expect(data.views).toHaveLength(1);
    expect(data.views[0]?.type).toBe("table");
  });

  it("parses filters", () => {
    const yaml = `
filters:
  and:
    - 'status == "done"'
    - 'priority > 3'
views:
  - type: table
`;
    const data = parseBasesData(yaml);
    expect(data).toBeDefined();
    expect(data!.filters).toBeDefined();
  });

  it("returns null for invalid YAML", () => {
    const data = parseBasesData("{{{{invalid");
    expect(data).toBeNull();
  });

  it("normalizes sort entries", () => {
    const yaml = `
views:
  - type: table
    sort:
      - column: priority
      - property: status
      - direction: DESC
      - property: created
        direction: DESC
`;
    const data = parseBasesData(yaml);
    expect(data?.views?.[0]?.sort).toEqual([
      { property: "priority", direction: "ASC" },
      { property: "status", direction: "ASC" },
      { property: "created", direction: "DESC" },
    ]);
  });
});

describe("expression parser", () => {
  it("parses literals", () => {
    expect(normalizeExpression(parseExpression("42"))).toEqual({
      type: "Literal",
      value: 42,
    });
    expect(normalizeExpression(parseExpression("'hello'"))).toEqual({
      type: "Literal",
      value: "hello",
    });
    expect(normalizeExpression(parseExpression("true"))).toEqual({
      type: "Literal",
      value: true,
    });
    expect(normalizeExpression(parseExpression("false"))).toEqual({
      type: "Literal",
      value: false,
    });
    expect(normalizeExpression(parseExpression("null"))).toEqual({
      type: "Literal",
      value: null,
    });
  });

  it("parses identifiers", () => {
    expect(normalizeExpression(parseExpression("status"))).toEqual({
      type: "Identifier",
      name: "status",
    });
  });

  it("parses unary expressions", () => {
    expect(normalizeExpression(parseExpression("-score"))).toEqual({
      type: "Unary",
      operator: "-",
      argument: { type: "Identifier", name: "score" },
    });
    expect(normalizeExpression(parseExpression("!done"))).toEqual({
      type: "Unary",
      operator: "!",
      argument: { type: "Identifier", name: "done" },
    });
    expect(normalizeExpression(parseExpression("not done"))).toEqual({
      type: "Unary",
      operator: "!",
      argument: { type: "Identifier", name: "done" },
    });
  });

  it("parses binary expressions", () => {
    expect(normalizeExpression(parseExpression("1 + 2"))).toEqual({
      type: "Binary",
      operator: "+",
      left: { type: "Literal", value: 1 },
      right: { type: "Literal", value: 2 },
    });
    expect(normalizeExpression(parseExpression("3 * 4"))).toEqual({
      type: "Binary",
      operator: "*",
      left: { type: "Literal", value: 3 },
      right: { type: "Literal", value: 4 },
    });
    expect(normalizeExpression(parseExpression("10 % 3"))).toEqual({
      type: "Binary",
      operator: "%",
      left: { type: "Literal", value: 10 },
      right: { type: "Literal", value: 3 },
    });
    expect(normalizeExpression(parseExpression("a > b"))).toEqual({
      type: "Binary",
      operator: ">",
      left: { type: "Identifier", name: "a" },
      right: { type: "Identifier", name: "b" },
    });
    expect(normalizeExpression(parseExpression("x && y"))).toEqual({
      type: "Binary",
      operator: "&&",
      left: { type: "Identifier", name: "x" },
      right: { type: "Identifier", name: "y" },
    });
    expect(normalizeExpression(parseExpression("x or y"))).toEqual({
      type: "Binary",
      operator: "||",
      left: { type: "Identifier", name: "x" },
      right: { type: "Identifier", name: "y" },
    });
  });

  it("respects operator precedence", () => {
    expect(normalizeExpression(parseExpression("1 + 2 * 3"))).toEqual({
      type: "Binary",
      operator: "+",
      left: { type: "Literal", value: 1 },
      right: {
        type: "Binary",
        operator: "*",
        left: { type: "Literal", value: 2 },
        right: { type: "Literal", value: 3 },
      },
    });
  });

  it("parses parenthesized expressions", () => {
    expect(normalizeExpression(parseExpression("(1 + 2) * 3"))).toEqual({
      type: "Binary",
      operator: "*",
      left: {
        type: "Binary",
        operator: "+",
        left: { type: "Literal", value: 1 },
        right: { type: "Literal", value: 2 },
      },
      right: { type: "Literal", value: 3 },
    });
  });

  it("parses function calls", () => {
    expect(normalizeExpression(parseExpression('contains(tags, "foo")'))).toEqual({
      type: "Call",
      callee: { type: "Identifier", name: "contains" },
      args: [
        { type: "Identifier", name: "tags" },
        { type: "Literal", value: "foo" },
      ],
    });
  });

  it("parses member access and method calls", () => {
    expect(normalizeExpression(parseExpression("file.name"))).toEqual({
      type: "Member",
      object: { type: "Identifier", name: "file" },
      property: "name",
    });
    expect(normalizeExpression(parseExpression("name.lower()"))).toEqual({
      type: "Call",
      callee: {
        type: "Member",
        object: { type: "Identifier", name: "name" },
        property: "lower",
      },
      args: [],
    });
  });

  it("parses index access", () => {
    expect(normalizeExpression(parseExpression("list[0]"))).toEqual({
      type: "Index",
      object: { type: "Identifier", name: "list" },
      index: { type: "Literal", value: 0 },
    });
  });

  it("parses list literals", () => {
    expect(normalizeExpression(parseExpression("[1, 2, 3]"))).toEqual({
      type: "List",
      elements: [
        { type: "Literal", value: 1 },
        { type: "Literal", value: 2 },
        { type: "Literal", value: 3 },
      ],
    });
  });

  it("errors on unexpected tokens", () => {
    expect(() => parseExpression(")")).toThrow("Unexpected token");
  });

  it("errors on missing closing paren or bracket", () => {
    expect(() => parseExpression("(1 + 2")).toThrow("Expected ')'");
    expect(() => parseExpression("[1, 2")).toThrow("Expected ']'");
  });
});
